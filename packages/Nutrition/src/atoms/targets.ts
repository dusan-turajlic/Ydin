import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import {
    getTargets,
    getTargetsForDay,
    hasCompletedSetup,
    type DailyTargets as StoredDailyTargets,
} from "@/services/storage/targets";

/**
 * Full daily nutrition targets including extended nutrients
 * This extends the basic DailyTargets from storage with vitamins/minerals
 */
export interface FullDailyTargets {
    // Main macros (from storage)
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;

    // Carb breakdown
    sugars: number;
    starch: number;

    // Fat breakdown
    saturated: number;
    monounsaturated: number;
    polyunsaturated: number;
    transFat: number;
    omega3: number;
    omega3Ala: number;
    omega3Dha: number;
    omega3Epa: number;
    omega6: number;

    // Vitamins (mg or μg as noted)
    vitaminA: number;      // μg
    vitaminC: number;      // mg
    vitaminD: number;      // μg
    vitaminE: number;      // mg
    vitaminK: number;      // μg
    thiamine: number;      // mg (B1)
    riboflavin: number;    // mg (B2)
    niacin: number;        // mg (B3)
    pantothenicAcid: number; // mg (B5)
    vitaminB6: number;     // mg
    biotin: number;        // mg (B7)
    folate: number;        // μg

    // Minerals
    calcium: number;       // mg
    copper: number;        // mg
    iron: number;          // mg
    magnesium: number;     // mg
    manganese: number;     // mg
    phosphorus: number;    // mg
    potassium: number;     // mg
    selenium: number;      // μg
    sodium: number;        // mg
    zinc: number;          // mg

    // Other
    water: number;         // g
    caffeine: number;      // mg
    cholesterol: number;   // mg
    alcohol: number;       // g
}

/**
 * Default targets used when no stored targets exist
 * Based on general nutrition guidelines
 */
export const DEFAULT_TARGETS: FullDailyTargets = {
    // Main macros
    calories: 2400,
    protein: 200,
    fat: 90,
    carbs: 225,
    fiber: 25,

    // Carb breakdown
    sugars: 50,
    starch: 150,

    // Fat breakdown
    saturated: 10,
    monounsaturated: 20,
    polyunsaturated: 10,
    transFat: 0,
    omega3: 1.6,
    omega3Ala: 1,
    omega3Dha: 0.2,
    omega3Epa: 0.25,
    omega6: 10,

    // Vitamins
    vitaminA: 900,
    vitaminC: 90,
    vitaminD: 4,
    vitaminE: 15,
    vitaminK: 90,
    thiamine: 1.2,
    riboflavin: 1,
    niacin: 16,
    pantothenicAcid: 5,
    vitaminB6: 1.3,
    biotin: 4,
    folate: 400,

    // Minerals
    calcium: 1000,
    copper: 0.9,
    iron: 8,
    magnesium: 420,
    manganese: 2.3,
    phosphorus: 700,
    potassium: 4500,
    selenium: 70,
    sodium: 2000,
    zinc: 11,

    // Other
    water: 3000,
    caffeine: 400,
    cholesterol: 300,
    alcohol: 0,
};

/**
 * Merge stored targets with defaults for extended nutrients
 */
function mergeWithDefaults(stored: StoredDailyTargets | null): FullDailyTargets {
    if (!stored) {
        return DEFAULT_TARGETS;
    }

    return {
        ...DEFAULT_TARGETS,
        // Override with stored values
        calories: stored.calories,
        protein: stored.protein,
        fat: stored.fat,
        carbs: stored.carbs,
        fiber: stored.fiber,
        sugars: stored.sugars ?? DEFAULT_TARGETS.sugars,
    };
}

/**
 * Atom to check if setup is complete
 * Used for routing decisions
 */
export const setupCompleteAtom = atom(async () => {
    return await hasCompletedSetup();
});

/**
 * Refresh trigger for targets
 * Increment to force refetch after settings change
 */
export const targetsRefreshAtom = atom(0);

/**
 * Trigger a refresh of targets
 */
export const triggerTargetsRefreshAtom = atom(null, (_get, set) => {
    set(targetsRefreshAtom, (prev) => prev + 1);
});

/**
 * Async atom that fetches targets from storage
 * Falls back to defaults if no stored targets exist
 */
export const targetsAtom = atom(async (get) => {
    // Subscribe to refresh trigger
    get(targetsRefreshAtom);

    const stored = await getTargets();
    return mergeWithDefaults(stored);
});

/**
 * Atom family for per-day targets
 * Used when user has variable calorie strategy
 * @param dayOfWeek - 0 = Sunday, 6 = Saturday
 */
export const dayTargetsAtomFamily = atomFamily((dayOfWeek: number) =>
    atom(async (get) => {
        // Subscribe to refresh trigger
        get(targetsRefreshAtom);

        const stored = await getTargetsForDay(dayOfWeek);
        return mergeWithDefaults(stored);
    })
);

// Re-export type alias for backwards compatibility
export type DailyTargets = FullDailyTargets;
