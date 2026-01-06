// Default WASM URL - assumes the file is served from the app's public folder
// Consuming apps should have wa-sqlite-async.wasm in their public directory
// This can be overridden via ProviderOptions.wasmUrl
export const wasmUrl = '/wa-sqlite-async.wasm';

// Cache for the WASM blob URL - ensures the WASM file is only fetched once per context
let cachedWasmBlobUrl: string | null = null;
let wasmFetchPromise: Promise<string> | null = null;

/**
 * Fetches the WASM file once and returns a cached blob URL.
 * Subsequent calls return the same blob URL without re-fetching.
 * 
 * This ensures the WASM binary is only downloaded once per JavaScript context
 * (main thread or worker), even if multiple SQLiteProvider instances are created.
 * 
 * @param url - The URL to fetch the WASM file from (defaults to wasmUrl)
 * @returns A blob URL pointing to the cached WASM file
 */
export async function getCachedWasmUrl(url: string = wasmUrl): Promise<string> {
    // Return cached blob URL if available
    if (cachedWasmBlobUrl !== null) {
        return cachedWasmBlobUrl;
    }

    // If a fetch is already in progress, wait for it
    if (wasmFetchPromise !== null) {
        return wasmFetchPromise;
    }

    // Start fetching and cache the promise to prevent duplicate requests
    wasmFetchPromise = (async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch WASM: HTTP ${response.status}`);
            }

            const blob = await response.blob();
            cachedWasmBlobUrl = URL.createObjectURL(blob);
            return cachedWasmBlobUrl;
        } catch (error) {
            // Reset promise on error so retry is possible
            wasmFetchPromise = null;
            throw error;
        }
    })();

    return wasmFetchPromise;
}

/**
 * Clears the cached WASM blob URL.
 * Useful for testing or when you need to force a re-fetch.
 */
export function clearWasmCache(): void {
    if (cachedWasmBlobUrl !== null) {
        URL.revokeObjectURL(cachedWasmBlobUrl);
        cachedWasmBlobUrl = null;
    }
    wasmFetchPromise = null;
}
