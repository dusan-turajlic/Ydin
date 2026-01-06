import { atom } from "jotai";
import { Day, type CoreDate } from "@/domain";
import { getDay, addItem, type DayEntries, type AddDiaryItemInput } from "@/services/storage/diary";

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

// ─────────────────────────────────────────────────────────────
// Selected Day Atom
// ─────────────────────────────────────────────────────────────

/**
 * The currently selected day for viewing/logging entries.
 * Defaults to today. Set by WeekDaySelector.
 */
export const selectedDayAtom = atom<CoreDate>(Day.today());

/**
 * Derived atom for the selected day's UUID (for comparison)
 */
export const selectedDayUUIDAtom = atom((get) => {
    return Day.toUUID(get(selectedDayAtom));
});

// ─────────────────────────────────────────────────────────────
// Refresh Trigger
// ─────────────────────────────────────────────────────────────

/**
 * Counter atom to trigger refetching of day entries.
 * Increment this after adding/removing entries.
 */
export const refreshTriggerAtom = atom(0);

/**
 * Write-only atom to trigger a refresh of day entries
 */
export const triggerRefreshAtom = atom(
    null,
    (_get, set) => {
        set(refreshTriggerAtom, (prev) => prev + 1);
    }
);

// ─────────────────────────────────────────────────────────────
// Day Entries Atom (async)
// ─────────────────────────────────────────────────────────────

/**
 * Async atom that fetches entries for the selected day.
 * Automatically refetches when selectedDayAtom or refreshTriggerAtom changes.
 */
export const dayEntriesAtom = atom(async (get) => {
    const selectedDay = get(selectedDayAtom);
    // Subscribe to refresh trigger to enable refetching
    get(refreshTriggerAtom);

    const entries = await getDay(selectedDay);
    return entries;
});

// ─────────────────────────────────────────────────────────────
// Add Entry Atom
// ─────────────────────────────────────────────────────────────

/**
 * Input for adding a new diary entry via the atom
 */
export interface AddEntryInput {
    hour: number;
    entry: AddDiaryItemInput;
}

/**
 * Write-only atom that adds an entry to storage and triggers a refresh.
 * Uses the currently selected day.
 */
export const addEntryAndRefreshAtom = atom(
    null,
    async (get, set, input: AddEntryInput) => {
        const selectedDay = get(selectedDayAtom);

        // Persist to storage
        await addItem(selectedDay, input.hour, input.entry);

        // Trigger refresh to update the UI
        set(refreshTriggerAtom, (prev) => prev + 1);
    }
);

// ─────────────────────────────────────────────────────────────
// Daily Totals (computed from entries)
// ─────────────────────────────────────────────────────────────

/**
 * Derived atom that computes total macros from the day's entries
 */
export const dailyTotalsAtom = atom(async (get) => {
    const entries = await get(dayEntriesAtom);

    const totals: FoodMacros = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        sugars: 0,
    };

    // Flatten all entries from all hours and sum up
    for (const hourEntries of Object.values(entries)) {
        for (const entry of hourEntries) {
            totals.calories += entry.macros.calories;
            totals.protein += entry.macros.protein;
            totals.fat += entry.macros.fat;
            totals.carbs += entry.macros.carbs;
            totals.fiber += entry.macros.fiber;
            totals.sugars += entry.macros.sugars;
        }
    }

    return totals;
});

// Re-export DayEntries type for convenience
export type { DayEntries };
