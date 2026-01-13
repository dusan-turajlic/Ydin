// Import the bundled WASM file - Vite will handle serving it
// The ?url suffix tells Vite to return the URL to the asset
import wasmAssetUrl from './wa-sqlite-async.wasm?url';

// Export the bundled WASM URL as the default
// This ensures the WASM is always available without requiring CDN or manual setup
export const wasmUrl = wasmAssetUrl;

// Cache for the WASM blob URL - ensures the WASM file is only fetched once per context
// Map of source URL -> blob URL
const cachedWasmBlobUrls = new Map<string, string>();
const wasmFetchPromises = new Map<string, Promise<string>>();

/**
 * Fetches the WASM file once and returns a cached blob URL.
 * Subsequent calls with the same URL return the cached blob URL without re-fetching.
 * 
 * This ensures the WASM binary is only downloaded once per JavaScript context
 * (main thread or worker), even if multiple SQLiteProvider instances are created.
 * 
 * If the fetch fails, it falls back to returning the original URL so the
 * underlying library can handle the fetch itself (useful for test environments).
 * 
 * @param url - The URL to fetch the WASM file from (defaults to wasmUrl)
 * @returns A blob URL pointing to the cached WASM file, or the original URL on failure
 */
export async function getCachedWasmUrl(url: string = wasmUrl): Promise<string> {
    // Return cached blob URL if available for this source URL
    const cached = cachedWasmBlobUrls.get(url);
    if (cached !== undefined) {
        return cached;
    }

    // If a fetch is already in progress for this URL, wait for it
    const existingPromise = wasmFetchPromises.get(url);
    if (existingPromise !== undefined) {
        return existingPromise;
    }

    // Start fetching and cache the promise to prevent duplicate requests
    const fetchPromise = (async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Fall back to original URL - let the library handle it
                console.warn(`WASM cache: fetch returned ${response.status}, falling back to original URL`);
                return url;
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            cachedWasmBlobUrls.set(url, blobUrl);
            return blobUrl;
        } catch (error) {
            // Fall back to original URL - let the library handle it
            // This can happen in test environments or when fetch is restricted
            console.warn(`WASM cache: fetch failed, falling back to original URL:`, error);
            return url;
        } finally {
            // Clean up the promise from the map once resolved
            wasmFetchPromises.delete(url);
        }
    })();

    wasmFetchPromises.set(url, fetchPromise);
    return fetchPromise;
}

/**
 * Clears the cached WASM blob URLs.
 * Useful for testing or when you need to force a re-fetch.
 */
export function clearWasmCache(): void {
    for (const blobUrl of cachedWasmBlobUrls.values()) {
        URL.revokeObjectURL(blobUrl);
    }
    cachedWasmBlobUrls.clear();
    wasmFetchPromises.clear();
}
