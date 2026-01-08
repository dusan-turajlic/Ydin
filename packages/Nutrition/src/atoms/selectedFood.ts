import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { getByBarcode } from "@/services/api/openFoodDex";
import type { Product } from "@/modals";

/**
 * Atom family for fetching and caching products by barcode.
 * Same code = same cached atom instance = no duplicate fetches.
 *
 * Usage:
 *   const product = useAtomValue(productAtomFamily(code));
 */
export const productAtomFamily = atomFamily((code: string) =>
    atom(async (): Promise<Product | null> => {
        if (!code) return null;
        return getByBarcode(code);
    })
);

/**
 * Shared atom for the current serving size in grams.
 * Written by ProductActionBar, read by ProductDetail.
 * Default is 100g.
 */
export const servingSizeAtom = atom<number>(100);

