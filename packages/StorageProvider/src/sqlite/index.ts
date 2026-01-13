import BaseProvider, { type IBaseSearchQuary, type ProviderOptions } from "../base";
import { v4 as uuidv4 } from 'uuid';
import { initSQLite, type SQLiteDB } from '@subframe7536/sqlite-wasm';
import { useOpfsStorage } from '@subframe7536/sqlite-wasm/opfs';
import { getCachedWasmUrl, wasmUrl as defaultWasmUrl } from '../assets/wasm';

const DB_STORE_NAME = 'app_store';
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const createNoDataError = () => new Error('No Data Found');

/** SQLite compatible types - matches the library's internal type */
type SQLiteCompatibleType = string | number | Uint8Array | bigint | null;

/** Database row structure for our app_store table */
interface DBRow {
    path: SQLiteCompatibleType;
    data: SQLiteCompatibleType;
    timestamp: SQLiteCompatibleType;
}

/** Type guard to check if a row has the expected structure */
function isDBRow(row: Record<string, SQLiteCompatibleType>): row is DBRow & Record<string, SQLiteCompatibleType> {
    return 'path' in row && 'data' in row;
}

/** Safely extract string from SQLiteCompatibleType */
function asString(value: SQLiteCompatibleType): string {
    if (typeof value === 'string') return value;
    if (value === null) return '';
    return String(value);
}

/** Safely extract number from SQLiteCompatibleType */
function asNumber(value: SQLiteCompatibleType): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'bigint') return Number(value);
    if (value === null) return 0;
    return Number(value);
}

export default class SQLiteProvider extends BaseProvider {
    private sqlite: SQLiteDB | null = null;
    private initPromise: Promise<SQLiteDB> | null = null;
    private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
    private readonly options: ProviderOptions | undefined;

    constructor(dbName?: string, dbVersion?: number, options?: ProviderOptions) {
        super(dbName ?? 'APP_DB', dbVersion ?? 1);
        this.options = options;
        // Don't initialize on construction - use lazy initialization
    }

    private async initDB(): Promise<SQLiteDB> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            try {
                // Get cached WASM blob URL - ensures WASM is only fetched once per context
                // even if multiple SQLiteProvider instances are created
                const wasmBlobUrl = await getCachedWasmUrl(this.options?.wasmUrl ?? defaultWasmUrl);

                // OPFS storage - faster and more reliable than IndexedDB
                // Note: OPFS requires the app to run in a Web Worker context
                const db = await initSQLite(
                    useOpfsStorage(`${this.dbName}.db`, { url: wasmBlobUrl })
                );

                // Create table if it doesn't exist
                await db.run(`
                    CREATE TABLE IF NOT EXISTS ${DB_STORE_NAME} (
                        path TEXT PRIMARY KEY,
                        data TEXT NOT NULL,
                        timestamp INTEGER NOT NULL
                    )
                `);

                // Create index on path for faster queries
                await db.run(`
                    CREATE INDEX IF NOT EXISTS idx_path ON ${DB_STORE_NAME}(path)
                `);

                this.sqlite = db;
                this.resetInactivityTimer();
                return this.sqlite;
            } catch (error) {
                throw new Error(`Failed to initialize SQLite: ${error}`);
            }
        })();

        return this.initPromise;
    }

    private resetInactivityTimer(): void {
        // Clear existing timer
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }

        // Set new timer to close connection after inactivity
        this.inactivityTimer = setTimeout(() => {
            this.closeConnection().catch(console.error);
        }, INACTIVITY_TIMEOUT_MS);
    }

    private async closeConnection(): Promise<void> {
        if (this.sqlite) {
            try {
                await this.sqlite.close();
            } catch (error) {
                console.error('Error closing SQLite connection:', error);
            } finally {
                this.sqlite = null;
                this.initPromise = null;
                if (this.inactivityTimer) {
                    clearTimeout(this.inactivityTimer);
                    this.inactivityTimer = null;
                }
            }
        }
    }

    private async getSQLite(): Promise<SQLiteDB> {
        // If connection is closed, reinitialize
        if (this.sqlite) {
            // Reset inactivity timer on each use
            this.resetInactivityTimer();
            return this.sqlite;
        }
        await this.initDB();
        return this.sqlite!;
    }

    /**
     * Manually close the database connection.
     * Useful for cleanup or when you know the connection won't be used for a while.
     */
    async close(): Promise<void> {
        await this.closeConnection();
    }

    async getAll<T>(path: string): Promise<T[]> {
        const sqlite = await this.getSQLite();
        const pathPrefix = `${path}/`;

        // Query all records where path starts with the given path prefix
        const results = await sqlite.run(
            `SELECT path, data, timestamp FROM ${DB_STORE_NAME} WHERE path LIKE ? ORDER BY timestamp DESC`,
            [`${pathPrefix}%`]
        );

        if (!results || results.length === 0) {
            throw createNoDataError();
        }

        // Filter results that start with the given path (extra safety check)
        // Parse JSON data and create object with id as key
        const entries = results
            .filter((row) => isDBRow(row) && asString(row.path).startsWith(pathPrefix))
            .sort((a, b) => asNumber(a.timestamp) - asNumber(b.timestamp))
            .map((row) => {
                const data = JSON.parse(asString(row.data)) as { id: string };
                return [data.id, data];
            });

        return Object.fromEntries(entries) as T[];
    }

    async get<T>(path: string): Promise<T> {
        const sqlite = await this.getSQLite();

        const results = await sqlite.run(
            `SELECT data FROM ${DB_STORE_NAME} WHERE path = ?`,
            [path]
        );

        if (!results || results.length === 0) {
            throw createNoDataError();
        }

        return JSON.parse(asString(results[0].data)) as T;
    }

    async search<T>(path: string, query: IBaseSearchQuary): Promise<T[]> {
        const sqlite = await this.getSQLite();
        const pathPrefix = `${path}/`;

        // Query all records where path starts with the given path prefix
        const results = await sqlite.run(
            `SELECT path, data FROM ${DB_STORE_NAME} WHERE path LIKE ?`,
            [`%${pathPrefix}%`]
        );

        const [key] = Object.keys(query);
        const queryValue = query[key];
        const matches: T[] = [];

        for (const row of results) {
            const rowPath = asString(row.path);
            if (!rowPath.startsWith(pathPrefix)) {
                continue;
            }

            const data = JSON.parse(asString(row.data)) as Record<string, string>;

            if (queryValue.fuzzy) {
                if (data[key]?.includes(queryValue.fuzzy)) {
                    matches.push(data as T);
                }
            }
            if (queryValue.exact) {
                if (data[key] === queryValue.exact) {
                    matches.push(data as T);
                }
            }
        }

        return matches;
    }

    async create<T>(path: string, data: T, generateId: boolean = true): Promise<T & { id: string }> {
        const sqlite = await this.getSQLite();
        const { fullPath, newData } = this._createRecord(path, data, generateId);

        await sqlite.run(
            `INSERT OR REPLACE INTO ${DB_STORE_NAME} (path, data, timestamp) VALUES (?, ?, ?)`,
            [fullPath, JSON.stringify(newData), Date.now()]
        );

        return newData as T & { id: string };
    }

    async createMany<T>(dataArray: { path: string, data: T }[], generateId: boolean = true): Promise<void> {
        const sqlite = await this.getSQLite();

        for (const item of dataArray) {
            const { fullPath, newData } = this._createRecord(item.path, item.data, generateId);

            await sqlite.run(
                `INSERT OR REPLACE INTO ${DB_STORE_NAME} (path, data, timestamp) VALUES (?, ?, ?)`,
                [fullPath, JSON.stringify(newData), Date.now()]
            );
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
        const sqlite = await this.getSQLite();

        // Get existing record
        const results = await sqlite.run(
            `SELECT data FROM ${DB_STORE_NAME} WHERE path = ?`,
            [path]
        );

        if (!results || results.length === 0 || !results[0].data) {
            throw createNoDataError();
        }

        const existingData = JSON.parse(asString(results[0].data)) as T;

        // Merge with existing data (deep copy to avoid reference issues)
        const newData = structuredClone({ ...existingData, ...data });

        await sqlite.run(
            `UPDATE ${DB_STORE_NAME} SET data = ?, timestamp = ? WHERE path = ?`,
            [JSON.stringify(newData), Date.now(), path]
        );

        return newData as T & { id: string };
    }

    async delete(path: string): Promise<void> {
        const sqlite = await this.getSQLite();

        await sqlite.run(
            `DELETE FROM ${DB_STORE_NAME} WHERE path = ?`,
            [path]
        );
    }
}

