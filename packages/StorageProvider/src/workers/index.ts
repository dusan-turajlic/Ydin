/**
 * Worker utilities for StorageProvider
 * 
 * Provides helpers for running database operations in Web Workers
 * to avoid blocking the main thread and to serialize writes.
 */

export { spawnDatabaseWorker } from './spawnDatabaseWorker';
export type { SpawnDatabaseWorkerOptions, DatabaseWorkerHandle } from './spawnDatabaseWorker';
