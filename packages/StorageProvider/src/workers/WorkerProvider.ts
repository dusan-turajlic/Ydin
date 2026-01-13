/**
 * WorkerProvider - A provider that runs database operations in a Web Worker.
 * 
 * This is useful for SQLite with OPFS which requires a dedicated Worker context.
 * It extends BaseProvider and delegates all operations to a database worker via MessageChannel.
 */

import BaseProvider, { type IBaseSearchQuary, type ProviderOptions } from '../base';
import type { ProviderType } from '../index';

/** Database operation request types */
type DBRequest =
    | { id: number; op: 'get'; path: string }
    | { id: number; op: 'getAll'; path: string }
    | { id: number; op: 'create'; path: string; data: unknown; generateId?: boolean }
    | { id: number; op: 'createMany'; dataArray: { path: string; data: unknown }[]; generateId?: boolean }
    | { id: number; op: 'search'; path: string; query: IBaseSearchQuary }
    | { id: number; op: 'update'; path: string; data: unknown }
    | { id: number; op: 'delete'; path: string };

/** Database operation response types */
type DBResponse =
    | { id: number; success: true; data?: unknown }
    | { id: number; success: false; error: string };

export interface WorkerProviderOptions extends ProviderOptions {
    /** Optional custom worker URL for testing */
    workerUrl?: URL;
}

/**
 * A provider that runs all operations inside a Web Worker.
 * 
 * Use this when you need SQLite with OPFS from the main thread,
 * as OPFS sync access handles only work inside dedicated Workers.
 */
export class WorkerProvider extends BaseProvider {
    private worker: Worker | null = null;
    private port: MessagePort | null = null;
    private requestId = 0;
    private pendingRequests = new Map<number, {
        resolve: (value: unknown) => void;
        reject: (error: Error) => void;
    }>();
    private initPromise: Promise<void> | null = null;
    private readonly providerType: ProviderType;
    private readonly options?: WorkerProviderOptions;

    constructor(
        providerType: ProviderType,
        dbName: string = 'APP_DB',
        dbVersion: number = 1,
        options?: WorkerProviderOptions
    ) {
        super(dbName, dbVersion);
        this.providerType = providerType;
        this.options = options;
    }

    private async init(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            // Create the worker
            const workerUrl = this.options?.workerUrl ?? 
                new URL('./database.worker.ts', import.meta.url);
            
            this.worker = new Worker(workerUrl, { type: 'module' });

            // Initialize the provider in the worker
            this.worker.postMessage({
                type: 'init',
                providerType: this.providerType,
                dbName: this.dbName,
                dbVersion: this.dbVersion,
                options: this.options
            });

            // Create a MessageChannel for communication
            const channel = new MessageChannel();
            this.port = channel.port2;

            // Register port with worker
            this.worker.postMessage({ type: 'register' }, [channel.port1]);

            // Handle responses
            this.port.onmessage = (e: MessageEvent<DBResponse>) => {
                const response = e.data;
                const pending = this.pendingRequests.get(response.id);
                
                if (pending) {
                    this.pendingRequests.delete(response.id);
                    if (response.success) {
                        pending.resolve(response.data);
                    } else {
                        pending.reject(new Error(response.error));
                    }
                }
            };

            this.port.start();

            // Give the worker a moment to initialize
            await new Promise(resolve => setTimeout(resolve, 50));
        })();

        return this.initPromise;
    }

    private async send<T>(request: Omit<DBRequest, 'id'>): Promise<T> {
        await this.init();

        const id = ++this.requestId;
        const fullRequest = { ...request, id } as DBRequest;

        return new Promise<T>((resolve, reject) => {
            this.pendingRequests.set(id, {
                resolve: resolve as (value: unknown) => void,
                reject
            });
            this.port!.postMessage(fullRequest);
        });
    }

    async get<T>(path: string): Promise<T> {
        return this.send<T>({ op: 'get', path });
    }

    async getAll<T>(path: string): Promise<T[]> {
        return this.send<T[]>({ op: 'getAll', path });
    }

    async create<T>(path: string, data: T, generateId: boolean = true): Promise<T & { id: string }> {
        return this.send<T & { id: string }>({ op: 'create', path, data, generateId });
    }

    async createMany<T>(dataArray: { path: string; data: T }[], generateId: boolean = true): Promise<void> {
        return this.send<void>({ op: 'createMany', dataArray, generateId });
    }

    async search<T>(path: string, query: IBaseSearchQuary): Promise<T[]> {
        return this.send<T[]>({ op: 'search', path, query });
    }

    async update<T>(path: string, data: Partial<T>): Promise<T> {
        return this.send<T>({ op: 'update', path, data });
    }

    async delete(path: string): Promise<void> {
        return this.send<void>({ op: 'delete', path });
    }

    /**
     * Terminate the worker and clean up resources.
     */
    terminate(): void {
        if (this.port) {
            this.port.close();
            this.port = null;
        }
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.initPromise = null;
        
        // Reject any pending requests
        for (const [, pending] of this.pendingRequests) {
            pending.reject(new Error('Worker terminated'));
        }
        this.pendingRequests.clear();
    }
}
