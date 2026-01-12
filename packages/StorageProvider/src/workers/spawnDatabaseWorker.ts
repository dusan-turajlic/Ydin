/**
 * Helper to spawn a Database Worker.
 * 
 * The Database Worker owns a single storage provider connection.
 * Other workers (download workers, etc.) can communicate with it
 * via MessageChannel ports to perform database operations.
 * 
 * This serializes writes and avoids "database locked" errors.
 */

import type { ProviderType, ProviderOptions } from '../index';

export interface SpawnDatabaseWorkerOptions {
    /** The type of storage provider to use */
    providerType: ProviderType;
    /** Database name */
    dbName: string;
    /** Database version (default: 1) */
    dbVersion?: number;
    /** Provider-specific options (e.g., wasmUrl for SQLite) */
    options?: ProviderOptions;
}

export interface DatabaseWorkerHandle {
    /** The underlying Worker instance */
    worker: Worker;
    /** Create a MessagePort for a client worker to communicate with the database worker */
    createPort(): MessagePort;
    /** Terminate the database worker */
    terminate(): void;
}

/**
 * Spawns a Database Worker that owns a storage provider connection.
 * 
 * @example
 * ```typescript
 * const dbWorker = spawnDatabaseWorker({
 *   providerType: 'sqlite',
 *   dbName: 'MY_DATABASE',
 *   dbVersion: 1
 * });
 * 
 * // Create a port for a processing worker
 * const port = dbWorker.createPort();
 * processingWorker.postMessage({ type: 'init' }, [port]);
 * ```
 */
export function spawnDatabaseWorker(config: SpawnDatabaseWorkerOptions): DatabaseWorkerHandle {
    const { providerType, dbName, dbVersion = 1, options } = config;

    const worker = new Worker(
        new URL('./database.worker.ts', import.meta.url),
        { type: 'module' }
    );

    // Initialize the provider in the worker
    worker.postMessage({
        type: 'init',
        providerType,
        dbName,
        dbVersion,
        options
    });

    return {
        worker,

        createPort(): MessagePort {
            const channel = new MessageChannel();
            // Send port1 to the database worker
            worker.postMessage({ type: 'register' }, [channel.port1]);
            // Return port2 for the client worker to use
            return channel.port2;
        },

        terminate(): void {
            worker.terminate();
        }
    };
}

