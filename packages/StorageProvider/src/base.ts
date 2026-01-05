export interface IBaseSearchQuary {
    [key: string]: {
        fuzzy?: string;
        exact?: string;
    };
}

/**
 * Generic provider options interface.
 * All fields are optional - each provider should check if a field exists before using it.
 * This allows a single options object to work with any provider type.
 */
export interface ProviderOptions {
    // SQLite provider options
    wasmUrl?: string;

    // Future options for other providers can be added here
    // All fields should remain optional
}

export default abstract class BaseProvider {
    dbName: string;
    dbVersion: number;

    constructor(dbName: string, dbVersion: number) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    abstract getAll<T>(path: string): Promise<T[]>;
    abstract get<T>(path: string): Promise<T>;
    abstract create<T>(path: string, data: T, generateId?: boolean): Promise<T & { id: string }>;
    abstract createMany<T>(dataArray: { path: string, data: T }[], generateId?: boolean): Promise<void>;
    abstract search<T>(path: string, query: IBaseSearchQuary): Promise<T[]>;
    abstract update<T>(path: string, data: Partial<T>): Promise<T>;
    abstract delete(path: string): Promise<void>;
}

