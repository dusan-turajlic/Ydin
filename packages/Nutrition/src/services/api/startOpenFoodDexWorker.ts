import type { IOpenFoodDexObject } from "@/modals";
import createProvider from "@ydin/storage-provider";
import { spawnDatabaseWorker, type DatabaseWorkerHandle } from "@ydin/storage-provider/workers";
import { DB_NAME, DB_VERSION } from "./openFoodDex";

/**
 * Get or create the Database Worker.
 * This ensures all download workers share the same database connection.
 */
function getDatabaseWorker(): DatabaseWorkerHandle {
    return spawnDatabaseWorker({
        providerType: 'sqlite',
        dbName: DB_NAME,
        dbVersion: DB_VERSION
    });;
}

/**
 * Provider for reading from the database (main thread).
 * Download workers use the Database Worker for writing.
 */
const provider = createProvider('sqlite', DB_NAME, DB_VERSION);

async function startOpenFoodDexWorker(url: string) {
    const worker = new Worker(
        new URL("@/services/api/openFoodDex/worker.ts", import.meta.url),
        { type: "module" }
    );

    // Get a port to the Database Worker for this download worker
    const dbPort = getDatabaseWorker().createPort();

    // Initialize the download worker with the database port
    worker.postMessage({ type: "init" }, [dbPort]);

    worker.addEventListener('message', (e) => {
        if (e.data?.type === 'done') {
            console.debug('Download complete for:', url);
        }
        if (e.data?.type === 'progress') {
            console.debug('Progress:', e.data.data.count, 'items');
        }
        if (e.data?.type === 'error') {
            console.error('Download error:', e.data.data.message);
        }
    });

    // Start the download
    worker.postMessage({ type: "start", url });

    return worker;
}

/**
 * Start downloading food data from the given URL.
 * Multiple downloads can run in parallel - they all share a single
 * Database Worker which serializes writes to avoid lock errors.
 * 
 * @param url - URL to the localized food index (ndjson format)
 */
export async function startOpenFoodDex(url: string) {
    // Check if we already have data
    const content = await provider.getAll<IOpenFoodDexObject>('/products').catch(() => ({}));
    console.log('Existing content count:', Object.keys(content).length);

    if (!Object.keys(content).length) {
        await startOpenFoodDexWorker(url);
    }
}
