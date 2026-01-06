/**
 * Time - Static utility class for time-level operations (hours, minutes).
 * Adds DateConfig awareness on top of CoreDate's pure operations.
 */
import { v3 as uuidv3 } from 'uuid';
import { CoreDate } from './CoreDate';
import DateConfig from './DateConfig';

export class Time {
    // ─────────────────────────────────────────────────────────────
    // Time operations (delegate to CoreDate)
    // ─────────────────────────────────────────────────────────────

    /**
     * Create a new CoreDate with a specific hour (UTC)
     */
    static withHour(date: CoreDate, hour: number): CoreDate {
        return date.atHour(hour);
    }

    /**
     * Create a new CoreDate with specific hour and minute (UTC)
     */
    static withTime(date: CoreDate, hour: number, minute: number = 0): CoreDate {
        return date.atTime(hour, minute);
    }

    // ─────────────────────────────────────────────────────────────
    // Formatting (DateConfig-aware)
    // ─────────────────────────────────────────────────────────────

    /**
     * Format time as a label (e.g., "14:00" or "2:00 PM")
     * Respects DateConfig.hour12 and DateConfig.locale
     */
    static toLabel(date: CoreDate, locale?: string): string {
        return date.formatTime({
            hour: '2-digit',
            minute: '2-digit',
            hour12: DateConfig.hour12
        }, locale ?? DateConfig.locale);
    }

    // ─────────────────────────────────────────────────────────────
    // UUID
    // ─────────────────────────────────────────────────────────────

    /**
     * Generate a deterministic UUID for a specific time within a namespace
     */
    static toUUID(date: CoreDate, namespace: string): string {
        const timeString = date.toISOString().split('T')[1];
        return uuidv3(timeString, namespace);
    }
}
