import { FOOD_DEX_URL } from "@/constants";
import type { IOpenFoodDexObject, Product } from "@/modals";
import createProvider from "@ydin/storage-provider";

export const DB_NAME = "OPEN_FOOD_DEX_DB";
export const DB_VERSION = 1;

const provider = createProvider("sqlite", DB_NAME, DB_VERSION); // create once

export async function search(freeText: string): Promise<IOpenFoodDexObject[]> {
    return provider.search<IOpenFoodDexObject>('/products', {
        name: {
            fuzzy: freeText
        }
    });
}

export async function getByBarcode(barcode: string): Promise<Product | null> {
    const res = await fetch(`${FOOD_DEX_URL}/products/${barcode}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}