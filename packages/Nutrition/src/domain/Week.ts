/**
 * Week - Instance class that holds state for a 7-day week.
 * The start day is configurable via DateConfig.weekStartsOn.
 */
import { v3 as uuidv3 } from 'uuid';
import { CoreDate } from './CoreDate';
import DateConfig from './DateConfig';

// UUID namespace for weeks (ISO week format: YYYY-Www)
// This should never change
const UUID_WEEK_NAMESPACE = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export class Week {
    readonly start: CoreDate;
    readonly days: CoreDate[];
    readonly uuid: string;

    /**
     * Creates a week containing the given date.
     * The start day is determined by DateConfig.weekStartsOn.
     */
    constructor(date: CoreDate) {
        this.start = this.calculateWeekStart(date);
        this.days = this.generateDays();
        this.uuid = this.generateUUID();
    }

    // ─────────────────────────────────────────────────────────────
    // Navigation (returns new Week instances)
    // ─────────────────────────────────────────────────────────────

    /**
     * Get the next week
     */
    next(): Week {
        return new Week(this.start.addDays(7));
    }

    /**
     * Get the previous week
     */
    prev(): Week {
        return new Week(this.start.addDays(-7));
    }


    // ─────────────────────────────────────────────────────────────
    // Utility
    // ─────────────────────────────────────────────────────────────

    /**
     * Check if a date falls within this week
     */
    contains(date: CoreDate): boolean {
        const first = this.days[0];
        const last = this.days[6];
        const dateStart = date.atStartOfDay();
        return (dateStart.equals(first) || dateStart.isAfter(first)) &&
            (dateStart.equals(last) || dateStart.isBefore(last));
    }

    // ─────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────

    private calculateWeekStart(date: CoreDate): CoreDate {
        const offset = DateConfig.weekStartsOn === 'sunday'
            ? date.weekday              // Sunday start: offset is weekday
            : (date.weekday + 6) % 7;   // Monday start: shift so Monday=0
        return date.addDays(-offset).atStartOfDay();
    }

    private generateDays(): CoreDate[] {
        return Array.from({ length: 7 }, (_, i) => this.start.addDays(i));
    }

    private generateUUID(): string {
        // Format: "2026-01-06" - the week's start date, simple and unique
        const weekId = `${this.start.year}-${this.start.month + 1}-${this.start.dayOfMonth}`;
        return uuidv3(weekId, UUID_WEEK_NAMESPACE);
    }
}
