/**
 * CoreDate - Minimal, immutable UTC date wrapper.
 * All dates are automatically normalized to UTC on construction.
 * Does only the basics - no day/week/time logic bleeds in here.
 */
export class CoreDate {
    readonly date: Date;

    /**
     * Private constructor - use static factories
     */
    private constructor(date: Date) {
        // Always store as UTC-normalized
        this.date = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds()
        ));
    }

    // ─────────────────────────────────────────────────────────────
    // Static factories (all normalize to UTC)
    // ─────────────────────────────────────────────────────────────

    /**
     * Current moment in UTC
     */
    static now(): CoreDate {
        return new CoreDate(new Date());
    }

    /**
     * Converts any Date to UTC
     */
    static fromDate(date: Date): CoreDate {
        return new CoreDate(date);
    }

    /**
     * Parse ISO string
     */
    static fromISO(iso: string): CoreDate {
        return new CoreDate(new Date(iso));
    }

    // ─────────────────────────────────────────────────────────────
    // Basic getters only
    // ─────────────────────────────────────────────────────────────

    get timestamp(): number {
        return this.date.getTime();
    }

    get year(): number {
        return this.date.getUTCFullYear();
    }

    get month(): number {
        return this.date.getUTCMonth(); // 0-11
    }

    get dayOfMonth(): number {
        return this.date.getUTCDate();
    }

    get hours(): number {
        return this.date.getUTCHours();
    }

    get minutes(): number {
        return this.date.getUTCMinutes();
    }

    /**
     * Raw weekday (0=Sunday, 1=Monday, ..., 6=Saturday)
     * Note: For config-aware weekday index, use Day.getWeekdayIndex()
     */
    get weekday(): number {
        return this.date.getUTCDay();
    }

    // ─────────────────────────────────────────────────────────────
    // Date manipulation (returns new instances)
    // ─────────────────────────────────────────────────────────────

    /**
     * Create new CoreDate at start of day (00:00 UTC)
     */
    atStartOfDay(): CoreDate {
        return new CoreDate(new Date(Date.UTC(
            this.year,
            this.month,
            this.dayOfMonth,
            0, 0, 0, 0
        )));
    }

    /**
     * Create new CoreDate with days added/subtracted
     */
    addDays(delta: number): CoreDate {
        const d = new Date(Date.UTC(
            this.year,
            this.month,
            this.dayOfMonth + delta,
            this.hours,
            this.minutes,
            0, 0
        ));
        return new CoreDate(d);
    }

    // ─────────────────────────────────────────────────────────────
    // Time manipulation (returns new instances)
    // ─────────────────────────────────────────────────────────────

    /**
     * Create new CoreDate at a specific hour (resets minutes/seconds to 0)
     */
    atHour(hour: number): CoreDate {
        return new CoreDate(new Date(Date.UTC(
            this.year,
            this.month,
            this.dayOfMonth,
            hour,
            0, 0, 0
        )));
    }

    /**
     * Create new CoreDate at a specific hour and minute
     */
    atTime(hour: number, minute: number = 0): CoreDate {
        return new CoreDate(new Date(Date.UTC(
            this.year,
            this.month,
            this.dayOfMonth,
            hour,
            minute,
            0, 0
        )));
    }

    // ─────────────────────────────────────────────────────────────
    // Formatting
    // ─────────────────────────────────────────────────────────────

    toISOString(): string {
        return this.date.toISOString();
    }

    /**
     * Format the time portion
     */
    formatTime(options: Intl.DateTimeFormatOptions, locale?: string): string {
        return this.date.toLocaleTimeString(locale, {
            ...options,
            timeZone: 'UTC'
        });
    }

    /**
     * Format the date portion
     */
    formatDate(options: Intl.DateTimeFormatOptions, locale?: string): string {
        return this.date.toLocaleDateString(locale, {
            ...options,
            timeZone: 'UTC'
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Comparison
    // ─────────────────────────────────────────────────────────────

    equals(other: CoreDate): boolean {
        return this.timestamp === other.timestamp;
    }

    isBefore(other: CoreDate): boolean {
        return this.timestamp < other.timestamp;
    }

    isAfter(other: CoreDate): boolean {
        return this.timestamp > other.timestamp;
    }
}

