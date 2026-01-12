/**
 * Database Worker
 * 
 * A Web Worker that owns a storage provider connection.
 * Multiple client workers can send database operations to this worker,
 * which processes them sequentially to avoid lock conflicts.
 * 
 * Provider-agnostic: works with SQLite, IndexedDB, or LocalStorage.
 */

import createProvider, { type ProviderType, type ProviderOptions } from '../index';
import type BaseProvider from '../base';
import type { IBaseSearchQuary } from '../base';

let provider: BaseProvider | null = null;
const clients: MessagePort[] = [];

/** Message types for initialization */
interface InitMessage {
    type: 'init';
    providerType: ProviderType;
    dbName: string;
    dbVersion: number;
    options?: ProviderOptions;
}

interface RegisterMessage {
    type: 'register';
}

type MainThreadMessage = InitMessage | RegisterMessage;

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

// Handle messages from main thread
self.onmessage = (e: MessageEvent<MainThreadMessage>) => {
    if (e.data.type === 'init') {
        const { providerType, dbName, dbVersion, options } = e.data;
        provider = createProvider(providerType, dbName, dbVersion, options);
    }

    if (e.data.type === 'register' && e.ports[0]) {
        const port = e.ports[0];
        clients.push(port);
        port.onmessage = handleClientMessage;
        port.start();
    }
};

/**
 * Handle database operation requests from client workers.
 * Operations are processed sequentially (single-threaded worker).
 */
async function handleClientMessage(e: MessageEvent<DBRequest>): Promise<void> {
    const port = e.target as MessagePort;
    const request = e.data;

    if (!provider) {
        const response: DBResponse = { id: request.id, success: false, error: 'Provider not initialized' };
        port.postMessage(response);
        return;
    }

    try {
        let data: unknown;

        switch (request.op) {
            case 'get':
                data = await provider.get(request.path);
                break;

            case 'getAll':
                data = await provider.getAll(request.path);
                break;

            case 'create':
                data = await provider.create(request.path, request.data, request.generateId);
                break;

            case 'createMany':
                await provider.createMany(request.dataArray, request.generateId);
                data = undefined;
                break;

            case 'search':
                data = await provider.search(request.path, request.query);
                break;

            case 'update':
                data = await provider.update(request.path, request.data as Partial<unknown>);
                break;

            case 'delete':
                await provider.delete(request.path);
                data = undefined;
                break;

            default: {
                const exhaustiveCheck: never = request;
                throw new Error(`Unknown operation: ${(exhaustiveCheck as DBRequest).op}`);
            }
        }

        const response: DBResponse = { id: request.id, success: true, data };
        port.postMessage(response);
    } catch (err) {
        const response: DBResponse = {
            id: request.id,
            success: false,
            error: err instanceof Error ? err.message : String(err)
        };
        port.postMessage(response);
    }
}

