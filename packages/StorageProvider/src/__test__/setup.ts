/**
 * Test setup for StorageProvider browser tests.
 * 
 * This intercepts fetch requests for the SQLite WASM file and serves it
 * from the node_modules directory, ensuring tests work in CI environments
 * where the public directory might not be served correctly.
 */

// Store the original fetch
const originalFetch = globalThis.fetch;

// WASM file content will be fetched once and cached
let wasmBlobUrl: string | null = null;
let wasmLoadPromise: Promise<string> | null = null;

async function getWasmBlobUrl(): Promise<string> {
    if (wasmBlobUrl) {
        return wasmBlobUrl;
    }

    if (wasmLoadPromise) {
        return wasmLoadPromise;
    }

    wasmLoadPromise = (async () => {
        // In browser tests, we can fetch the WASM from node_modules via the test server
        // The vitest browser server serves files from the package root
        const wasmPath = './node_modules/@subframe7536/sqlite-wasm/dist/wa-sqlite-async.wasm';
        
        const response = await originalFetch(wasmPath);
        if (!response.ok) {
            throw new Error(`Failed to load WASM from ${wasmPath}: ${response.status}`);
        }
        
        const blob = await response.blob();
        wasmBlobUrl = URL.createObjectURL(blob);
        return wasmBlobUrl;
    })();

    return wasmLoadPromise;
}

// Override fetch to intercept WASM requests
globalThis.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Intercept requests for the SQLite WASM file
    if (url.endsWith('wa-sqlite-async.wasm')) {
        try {
            const blobUrl = await getWasmBlobUrl();
            return originalFetch(blobUrl, init);
        } catch (error) {
            console.error('Failed to intercept WASM fetch:', error);
            // Fall through to original fetch
        }
    }
    
    return originalFetch(input, init);
};

