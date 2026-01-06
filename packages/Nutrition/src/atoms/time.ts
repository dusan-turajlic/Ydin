import { atom } from "jotai";
import { Day, Time, type CoreDate } from "@/domain";

/** First trackable hour of the day */
export const MIN_HOUR = 6;

/** Last trackable hour of the day */
export const MAX_HOUR = 23;

/**
 * Generate time slots for the diary (one CoreDate per trackable hour)
 */
export function generateTimeSlots(): CoreDate[] {
    const today = Day.today();
    return Array.from(
        { length: MAX_HOUR - MIN_HOUR + 1 },
        (_, i) => Time.withHour(today, MIN_HOUR + i)
    );
}

/**
 * Clamp an hour to valid time slot range (MIN_HOUR - MAX_HOUR)
 */
export function clampHour(hour: number): number {
    return Math.max(MIN_HOUR, Math.min(MAX_HOUR, hour));
}

/**
 * Internal: stores the user-selected hour (from clicking "+" on a time slot)
 * null means no explicit selection - use current time
 */
export const selectedHourAtom = atom<number | null>(null);

/**
 * Helper to get the current hour clamped to valid time slots (6-23).
 */
function getCurrentHourClamped(): number {
    const hour = new Date().getHours();
    return clampHour(hour);
}

/**
 * Read/write atom for the hour to log food at.
 * - Read: returns selectedHour if set, otherwise current hour (fresh)
 * - Write: set a specific hour, or null to clear selection
 */
export const logHourAtom = atom(
    (get) => {
        const selected = get(selectedHourAtom);
        return selected ?? getCurrentHourClamped();
    },
    (_get, set, hour: number | null) => {
        set(selectedHourAtom, hour);
    }
);

