import { atom } from "jotai";

export interface ProductActionState {
    productName: string;
    servingCount: number;
    totalServing: number;
    servingUnit: string;
    canDecrement: boolean;
}

/**
 * Atom to share product action bar state between ProductDetail and FoodSearchSheet
 */
export const productActionAtom = atom<ProductActionState | null>(null);

/**
 * Atom for the log food callback - set by ProductDetail, called by FoodSearchSheet
 */
export const logFoodCallbackAtom = atom<(() => Promise<void>) | null>(null);

/**
 * Atoms for increment/decrement callbacks
 */
export const incrementServingAtom = atom<(() => void) | null>(null);
export const decrementServingAtom = atom<(() => void) | null>(null);

