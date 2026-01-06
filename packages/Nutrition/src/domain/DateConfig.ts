/**
 * DateConfig - Locale-aware configuration for date/time formatting.
 * Can be updated at runtime (e.g., from user preferences).
 */

export type WeekStart = 'monday' | 'sunday';

export interface DateConfigOptions {
    locale: string;           // e.g., "en-US", "sv-SE"
    hour12: boolean;          // true = 12h clock, false = 24h clock
    weekStartsOn: WeekStart;  // 'monday' (EU/ISO) or 'sunday' (US)
}

const USER_LOCAL_LANGUAGE = globalThis.navigator?.language ?? 'en-US';

const DateConfig = {
    // Defaults - 24h clock, Monday start, browser locale
    locale: USER_LOCAL_LANGUAGE,
    hour12: false,
    weekStartsOn: 'monday' as WeekStart,

    /**
     * Update settings (e.g., from user preferences)
     */
    set(options: Partial<DateConfigOptions>): void {
        if (options.locale !== undefined) this.locale = options.locale;
        if (options.hour12 !== undefined) this.hour12 = options.hour12;
        if (options.weekStartsOn !== undefined) this.weekStartsOn = options.weekStartsOn;
    },

    /**
     * Reset to defaults
     */
    reset(): void {
        this.locale = USER_LOCAL_LANGUAGE;
        this.hour12 = false;
        this.weekStartsOn = 'monday';
    }
};

export default DateConfig;

