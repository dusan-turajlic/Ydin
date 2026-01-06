import BaseProvider, { type ProviderOptions } from "./base";
import IndexDBProvider from "./indexDB";
import LocalStorageProvider from "./localstorage";
import SQLiteProvider from "./sqlite";

// Re-export types and base class
export { default as BaseProvider } from "./base";
export type { IBaseSearchQuary, ProviderOptions } from "./base";

// Re-export provider implementations
export { default as IndexDBProvider } from "./indexDB";
export { default as LocalStorageProvider } from "./localstorage";
export { default as SQLiteProvider } from "./sqlite";

// Re-export assets (WASM URL and caching utilities for SQLite)
export { wasmUrl, getCachedWasmUrl, clearWasmCache } from "./assets/wasm";

export type ProviderType = 'local' | 'indexDB' | 'sqlite';

export default function createProvider(
    provider: ProviderType = 'indexDB',
    dbName?: string,
    dbVersion?: number,
    options?: ProviderOptions
): BaseProvider {
    switch (provider) {
        case 'local':
            return new LocalStorageProvider(
                dbName,
                dbVersion,
                options
            );
        case 'indexDB':
            return new IndexDBProvider(
                dbName,
                dbVersion,
                options
            );
        case 'sqlite':
            return new SQLiteProvider(
                dbName,
                dbVersion,
                options
            );
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

