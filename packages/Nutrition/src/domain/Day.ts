/**
 * Day - Static utility class for day-level operations.
 * Adds DateConfig awareness on top of CoreDate's pure operations.
 */
import { v3 as uuidv3 } from 'uuid';
import { CoreDate } from './CoreDate';
import { Week } from './Week';
import DateConfig from './DateConfig';

// UUID namespace for dates
// This should never change
const UUID_DATE_NAMESPACE = '5f50d310-7a34-43fb-9985-507fee938089';

export class Day {
    // ─────────────────────────────────────────────────────────────
    // Core operations (delegate to CoreDate)
    // ─────────────────────────────────────────────────────────────

    /**
     * Get today at 00:00 UTC
     */
    static today(): CoreDate {
        return CoreDate.now().atStartOfDay();
    }

    /**
     * Reset a date to 00:00 UTC (start of day)
     */
    static startOf(date: CoreDate): CoreDate {
        return date.atStartOfDay();
    }

    /**
     * Add or subtract days from a date
     */
    static add(date: CoreDate, delta: number): CoreDate {
        return date.addDays(delta);
    }

    /**
     * Check if two dates are the same day
     */
    static isSame(a: CoreDate, b: CoreDate): boolean {
        return a.year === b.year &&
            a.month === b.month &&
            a.dayOfMonth === b.dayOfMonth;
    }

    /**
     * Get the weekday index (0-6) respecting DateConfig.weekStartsOn.
     * - If weekStartsOn = 'monday': Mon=0, Tue=1, ..., Sun=6
     * - If weekStartsOn = 'sunday': Sun=0, Mon=1, ..., Sat=6
     */
    static getWeekdayIndex(date: CoreDate): number {
        if (DateConfig.weekStartsOn === 'sunday') {
            return date.weekday;
        }
        // Monday start: shift so Monday=0, Sunday=6
        return (date.weekday + 6) % 7;
    }

    // ─────────────────────────────────────────────────────────────
    // UUID
    // ─────────────────────────────────────────────────────────────

    /**
     * Generate a deterministic UUID for a date
     */
    static toUUID(date: CoreDate): string {
        const dateString = date.toISOString().split('T')[0];
        return uuidv3(dateString, UUID_DATE_NAMESPACE);
    }

    // ─────────────────────────────────────────────────────────────
    // Formatting (DateConfig-aware)
    // ─────────────────────────────────────────────────────────────

    /**
     * Format a date with given options
     */
    static format(
        date: CoreDate,
        options: Intl.DateTimeFormatOptions,
        locale?: string
    ): string {
        return date.formatDate(options, locale ?? DateConfig.locale);
    }

    /**
     * Get short weekday name (e.g., "Mon", "Tue")
     */
    static toShortWeekday(date: CoreDate, locale?: string): string {
        return date.formatDate({ weekday: 'short' }, locale ?? DateConfig.locale);
    }

    // ─────────────────────────────────────────────────────────────
    // Week operations
    // ─────────────────────────────────────────────────────────────

    /**
     * Get the week containing this day
     */
    static getWeek(date: CoreDate): Week {
        return new Week(date);
    }
}
