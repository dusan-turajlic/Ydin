import type { FoodMacros } from "@/atoms/day";

/**
 * A single diary item stored in the database.
 * Represents a food entry logged at a specific time slot.
 */
export interface DiaryItem {
    id: string;
    code: string;
    name: string;
    servingCount: number;
    servingSize: number;
    unit: string;
    macros: FoodMacros;
    loggedAt: string; // ISO timestamp
}

/**
 * Input for adding a new diary item (without id and loggedAt which are auto-generated).
 */
export interface AddDiaryItemInput {
    code: string;
    name: string;
    servingCount: number;
    servingSize: number;
    unit: string;
    macros: FoodMacros;
}

/**
 * Entries grouped by hour for a day.
 * Key is the hour (6-23), value is array of items for that hour.
 */
export type DayEntries = Record<number, DiaryItem[]>;

/**
 * Entries for a full week, grouped by day UUID then by hour.
 */
export type WeekEntries = Record<string, DayEntries>;

