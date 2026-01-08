import createProvider from "@ydin/storage-provider";
import { Day, CoreDate } from "@/domain";
import type { DiaryItem, AddDiaryItemInput, DayEntries, WeekEntries } from "./types";

export const DB_NAME = "NUTRITION_DIARY_DB";
export const DB_VERSION = 1;

// Use IndexedDB for diary - simpler and avoids WASM conflicts with OpenFoodDex SQLite
const provider = createProvider("sqlite", DB_NAME, DB_VERSION);

// Base path for all diary entries
const BASE_PATH = "/nutrition/log";

/**
 * Build the path for a specific week
 */
function getWeekPath(date: CoreDate): string {
    const week = Day.getWeek(date);
    return `${BASE_PATH}/weeks/${week.uuid}`;
}

/**
 * Build the path for a specific day
 */
function getDayPath(date: CoreDate): string {
    const weekPath = getWeekPath(date);
    const dayUUID = Day.toUUID(date);
    return `${weekPath}/days/${dayUUID}`;
}

/**
 * Build the path for a specific time slot (hour)
 */
function getTimeSlotPath(date: CoreDate, hour: number): string {
    const dayPath = getDayPath(date);
    return `${dayPath}/times/${hour}`;
}

/**
 * Build the path for items in a time slot
 */
function getItemsPath(date: CoreDate, hour: number): string {
    return `${getTimeSlotPath(date, hour)}/items`;
}

/**
 * Build the path for a specific item
 */
function getItemPath(date: CoreDate, hour: number, itemId: string): string {
    return `${getItemsPath(date, hour)}/${itemId}`;
}

/**
 * Get all entries for a week
 */
export async function getWeek(date: CoreDate): Promise<WeekEntries> {
    try {
        const weekPath = getWeekPath(date);
        const allItems = await provider.getAll<DiaryItem>(weekPath);

        // Group by day and hour
        const weekEntries: WeekEntries = {};

        for (const item of Object.values(allItems)) {
            const itemDate = CoreDate.fromISO(item.loggedAt);
            const dayUUID = Day.toUUID(itemDate);
            const hour = itemDate.hours;

            if (!weekEntries[dayUUID]) {
                weekEntries[dayUUID] = {};
            }
            if (!weekEntries[dayUUID][hour]) {
                weekEntries[dayUUID][hour] = [];
            }
            weekEntries[dayUUID][hour].push(item);
        }

        return weekEntries;
    } catch {
        return {};
    }
}

/**
 * Get all entries for a day
 */
export async function getDay(date: CoreDate): Promise<DayEntries> {
    try {
        const dayPath = getDayPath(date);
        const allItems = await provider.getAll<DiaryItem>(dayPath);

        // Group by hour
        const dayEntries: DayEntries = {};

        for (const item of Object.values(allItems)) {
            const itemDate = CoreDate.fromISO(item.loggedAt);
            const hour = itemDate.hours;

            if (!dayEntries[hour]) {
                dayEntries[hour] = [];
            }
            dayEntries[hour].push(item);
        }

        return dayEntries;
    } catch {
        return {};
    }
}

/**
 * Get entries for a specific time slot
 */
export async function getTimeSlot(date: CoreDate, hour: number): Promise<DiaryItem[]> {
    try {
        const itemsPath = getItemsPath(date, hour);
        const items = await provider.getAll<DiaryItem>(itemsPath);
        return Object.values(items);
    } catch {
        return [];
    }
}

/**
 * Add a food item to a specific time slot
 */
export async function addItem(
    date: CoreDate,
    hour: number,
    input: AddDiaryItemInput
): Promise<DiaryItem> {
    const itemsPath = getItemsPath(date, hour);

    // Create the log time based on the date and hour
    const logTime = date.atHour(hour);

    const itemData: Omit<DiaryItem, "id"> = {
        ...input,
        loggedAt: logTime.toISOString(),
    };

    const created = await provider.create<Omit<DiaryItem, "id">>(itemsPath, itemData);
    return created as DiaryItem;
}

/**
 * Delete a single item from a time slot
 */
export async function deleteItem(
    date: CoreDate,
    hour: number,
    itemId: string
): Promise<void> {
    const itemPath = getItemPath(date, hour, itemId);
    await provider.delete(itemPath);
}

/**
 * Clear all items in a time slot
 */
export async function clearTimeSlot(date: CoreDate, hour: number): Promise<void> {
    try {
        const items = await getTimeSlot(date, hour);
        for (const item of items) {
            await deleteItem(date, hour, item.id);
        }
    } catch {
        // No items to clear
    }
}

/**
 * Clear all items for a day
 */
export async function clearDay(date: CoreDate): Promise<void> {
    try {
        const dayEntries = await getDay(date);
        for (const [hourStr, items] of Object.entries(dayEntries)) {
            const hour = Number.parseInt(hourStr, 10);
            for (const item of items) {
                await deleteItem(date, hour, item.id);
            }
        }
    } catch {
        // No items to clear
    }
}

// Re-export types for convenience
export type { DiaryItem, AddDiaryItemInput, DayEntries, WeekEntries } from "./types";
