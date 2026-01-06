import { atom } from "jotai";
import type { CoreDate } from "@/domain";

/**
 * Macro values for a food entry
 */
export interface FoodMacros {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sugars: number;
    // Add more as needed
}

/**
 * A single food entry logged for the day
 */
export interface FoodEntry {
    id: string;
    code: string;
    name: string;
    time: CoreDate;
    servingCount: number;
    servingSize: number;
    unit: string;
    macros: FoodMacros;
}

/**
 * Atom containing all food entries for the current day
 */
export const dailyFoodEntriesAtom = atom<FoodEntry[]>([]);

/**
 * Derived atom that computes the total macros from all entries
 */
export const dailyTotalsAtom = atom((get) => {
    const entries = get(dailyFoodEntriesAtom);

    const totals: FoodMacros = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        sugars: 0,
    };

    for (const entry of entries) {
        totals.calories += entry.macros.calories;
        totals.protein += entry.macros.protein;
        totals.fat += entry.macros.fat;
        totals.carbs += entry.macros.carbs;
        totals.fiber += entry.macros.fiber;
        totals.sugars += entry.macros.sugars;
    }

    return totals;
});

/**
 * Input for adding a new food entry
 */
export interface AddFoodEntryInput {
    code: string;
    name: string;
    time: CoreDate;
    servingCount: number;
    servingSize: number;
    unit: string;
    macros: FoodMacros;
}

/**
 * Write-only atom to add a food entry
 */
export const addFoodEntryAtom = atom(
    null,
    (get, set, input: AddFoodEntryInput) => {
        const entries = get(dailyFoodEntriesAtom);
        const newEntry: FoodEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...input,
        };
        set(dailyFoodEntriesAtom, [...entries, newEntry]);
        return newEntry;
    }
);

/**
 * Write-only atom to remove a food entry by id
 */
export const removeFoodEntryAtom = atom(
    null,
    (get, set, id: string) => {
        const entries = get(dailyFoodEntriesAtom);
        set(dailyFoodEntriesAtom, entries.filter((entry) => entry.id !== id));
    }
);

/**
 * Write-only atom to clear all entries for the day
 */
export const clearDailyEntriesAtom = atom(
    null,
    (_get, set) => {
        set(dailyFoodEntriesAtom, []);
    }
);

