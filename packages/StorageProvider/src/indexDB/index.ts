import BaseProvider, { type IBaseSearchQuary, type ProviderOptions } from "../base";
import { v4 as uuidv4 } from 'uuid';
import IndexDB from './db';

const DB_NAME = 'APP_DB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'APP_STORE';

const createNoDataError = () => new Error('No Data Found');

export default class IndexDBProvider extends BaseProvider {
    private db: IDBDatabase | null = null;
    private dbPromise: Promise<IDBDatabase> | null = null;
    private readonly options: ProviderOptions | undefined;

    constructor(dbName?: string, dbVersion?: number, options?: ProviderOptions) {
        super(dbName ?? DB_NAME, dbVersion ?? DB_VERSION);
        // Options stored for future extensibility - always check if fields exist before using
        this.options = options;
        this.initDB();
    }

    // Expose options getter for potential future use
    protected getOptions(): ProviderOptions | undefined {
        return this.options;
    }

    private initDB(): Promise<IDBDatabase> {
        if (this.dbPromise) {
            return this.dbPromise;
        }

        this.dbPromise = new Promise((resolve, reject) => {
            const request = IndexDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject(new Error('Failed to open IndexDB'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                    const store = db.createObjectStore(DB_STORE_NAME, { keyPath: 'path' });
                    store.createIndex('path', 'path', { unique: true, multiEntry: true });
                }
            };
        });

        return this.dbPromise;
    }

    private async wrap<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const onSuccess = (ev: Event) => {
                cleanup();
                resolve((ev.target as IDBRequest<T>).result);
            };
            const onError = (ev: Event) => {
                cleanup();
                reject((ev.target as IDBRequest<T>).error ?? new DOMException("IDB request failed"));
            };
            const cleanup = () => {
                request.removeEventListener("success", onSuccess);
                request.removeEventListener("error", onError);
            };

            request.addEventListener("success", onSuccess);
            request.addEventListener("error", onError);
        });
    }

    private async getDB(): Promise<IDBDatabase> {
        if (!this.db) {
            await this.initDB();
        }
        return this.db!;
    }

    private async getTransaction(mode: IDBTransactionMode = 'readonly') {
        const db = await this.getDB();
        return db.transaction([DB_STORE_NAME], mode);
    }

    private async getStore(mode: IDBTransactionMode = 'readonly') {
        const transaction = await this.getTransaction(mode);
        return transaction.objectStore(DB_STORE_NAME);
    }

    async getAll<T>(path: string): Promise<T[]> {
        const store = await this.getStore('readonly');
        const index = store.index('path');
        // Range query for path prefix matching
        const range = IDBKeyRange.bound(path + '/', path + '/\uffff', false, true);

        type ResultItem = { data: T & { id: string }; timestamp: number };
        const results: ResultItem[] = [];

        return new Promise((resolve, reject) => {
            const request = index.openCursor(range);

            request.onerror = () => reject(request.error ?? new Error('IndexDB cursor error'));
            request.onsuccess = () => {
                const cursor = request.result;
                if (!cursor) {
                    if (results.length === 0) {
                        reject(createNoDataError());
                        return;
                    }
                    // Sort by timestamp descending and return as object map
                    const sorted = [...results].sort((a: ResultItem, b: ResultItem) => b.timestamp - a.timestamp);
                    resolve(Object.fromEntries(
                        sorted.map((item: ResultItem) => [item.data.id, item.data])
                    ) as unknown as T[]);
                    return;
                }
                results.push({ data: cursor.value.data, timestamp: cursor.value.timestamp });
                cursor.continue();
            };
        });
    }

    async get<T>(path: string): Promise<T> {
        const store = await this.getStore('readonly');

        const result = await this.wrap(store.get(path));

        if (!result || !result.data) {
            throw createNoDataError();
        }

        return result.data as T;
    }

    async search<T>(path: string, query: IBaseSearchQuary): Promise<T[]> {
        const store = await this.getStore('readonly');
        const index = store.index('path');

        const range = IDBKeyRange.bound(path, path + '\uffff', true, true);
        const matches: T[] = [];

        return new Promise((resolve, reject) => {
            const request = index.openCursor(range);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                const cursor = request.result;
                if (!cursor) {
                    resolve(matches);
                    return;
                }

                const data = cursor.value.data;
                const [key] = Object.keys(query);
                const queryValue = query[key];

                if (queryValue.fuzzy) {
                    if (data[key].includes(queryValue.fuzzy)) {
                        matches.push(data);
                    }
                }
                if (queryValue.exact) {
                    if (data[key] === queryValue.exact) {
                        matches.push(data);
                    }
                }

                cursor.continue();
            };
        });
    }

    async create<T>(path: string, data: T, generateId: boolean = true) {
        const store = await this.getStore('readwrite');
        const { fullPath, newData } = this._createRecord(path, data, generateId);
        const request = store.put({
            path: fullPath,
            data: newData,
            timestamp: Date.now()
        });

        await this.wrap(request);

        return newData as T & { id: string };
    }

    async createMany<T>(dataArray: { path: string, data: T }[], generateId: boolean = true): Promise<void> {
        const store = await this.getStore('readwrite');
        for await (const item of dataArray) {
            const { fullPath, newData } = this._createRecord(item.path, item.data, generateId);

            const request = store.put({
                path: fullPath,
                data: newData,
                timestamp: Date.now()
            });

            await this.wrap(request);
        }
    }

    private _createRecord<T>(path: string, data: T, generateId: boolean = true) {
        if (!generateId) {
            return {
                fullPath: path,
                newData: data
            };
        }
        const id = uuidv4();
        return {
            fullPath: `${path}/${id}`,
            newData: { ...data, id }
        };
    }

    async update<T>(path: string, data: Partial<T>): Promise<T & { id: string }> {
        const store = await this.getStore('readwrite');
        const result = await this.wrap(store.get(path));

        if (!result || !result.data) {
            throw createNoDataError();
        }

        const existingData = result.data;

        // This is needed incase we store nested objects in the data
        // otherwise we are saving references to the original object
        const newData = JSON.parse(JSON.stringify({ ...existingData, ...data }));
        const request = store.put({
            path: path,
            data: newData,
            timestamp: Date.now()
        });

        await this.wrap(request);

        return newData as T & { id: string };
    }

    async delete(path: string): Promise<void> {
        const store = await this.getStore('readwrite');
        const request = store.delete(path);

        await this.wrap(request);

        return;
    }
}

