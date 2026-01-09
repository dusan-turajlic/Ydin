import createProvider from "@ydin/storage-provider";
import type {
    UserSettings,
    CreateUserSettingsInput,
    UpdateUserSettingsInput,
    DailyTargets,
} from "./types";

export const DB_NAME = "NUTRITION_TARGETS_DB";
export const DB_VERSION = 1;

// Use SQLite provider for targets (same as diary)
const provider = createProvider("sqlite", DB_NAME, DB_VERSION);

// Base path for user settings/targets
const BASE_PATH = "/nutrition/targets";
const SETTINGS_PATH = `${BASE_PATH}/settings`;

/**
 * Check if user has completed setup
 */
export async function hasCompletedSetup(): Promise<boolean> {
    try {
        const settings = await getSettings();
        return settings?.setupComplete ?? false;
    } catch {
        return false;
    }
}

/**
 * Get user settings
 */
export async function getSettings(): Promise<UserSettings | null> {
    try {
        const allSettings = await provider.getAll<UserSettings>(SETTINGS_PATH);
        const settingsArray = Object.values(allSettings);
        // Return the first (and should be only) settings object
        return settingsArray.length > 0 ? settingsArray[0] : null;
    } catch {
        return null;
    }
}

/**
 * Get daily targets for a specific day of week
 * Returns per-day targets if using variable strategy, otherwise base targets
 */
export async function getTargetsForDay(dayOfWeek: number): Promise<DailyTargets | null> {
    try {
        const settings = await getSettings();
        if (!settings) return null;

        if (settings.calorieStrategy === "variable" && settings.perDayTargets) {
            return settings.perDayTargets[dayOfWeek] ?? settings.targets;
        }

        return settings.targets;
    } catch {
        return null;
    }
}

/**
 * Get base daily targets (regardless of day)
 */
export async function getTargets(): Promise<DailyTargets | null> {
    try {
        const settings = await getSettings();
        return settings?.targets ?? null;
    } catch {
        return null;
    }
}

/**
 * Create user settings (initial setup)
 */
export async function createSettings(
    input: CreateUserSettingsInput
): Promise<UserSettings> {
    const now = new Date().toISOString();

    const settingsData: Omit<UserSettings, "id"> = {
        ...input,
        setupComplete: true,
        createdAt: now,
        updatedAt: now,
    };

    const created = await provider.create<Omit<UserSettings, "id">>(
        SETTINGS_PATH,
        settingsData
    );

    return created as UserSettings;
}

/**
 * Update user settings
 */
export async function updateSettings(
    input: UpdateUserSettingsInput
): Promise<UserSettings | null> {
    try {
        const existing = await getSettings();
        if (!existing) return null;

        const settingsPath = `${SETTINGS_PATH}/${existing.id}`;
        const updateData = {
            ...input,
            updatedAt: new Date().toISOString(),
        };

        const updated = await provider.update<UserSettings>(settingsPath, updateData);
        return updated;
    } catch {
        return null;
    }
}

/**
 * Delete user settings (for reset/logout)
 */
export async function deleteSettings(): Promise<void> {
    try {
        const existing = await getSettings();
        if (existing) {
            const settingsPath = `${SETTINGS_PATH}/${existing.id}`;
            await provider.delete(settingsPath);
        }
    } catch {
        // Ignore errors on delete
    }
}

// Re-export types for convenience
export type {
    UserSettings,
    CreateUserSettingsInput,
    UpdateUserSettingsInput,
    DailyTargets,
    BiologicalProfile,
    HeightUnit,
    WeightUnit,
    SetupMode,
    CalorieStrategy,
    UserProfile,
    ActivityData,
    PerDayTargets,
} from "./types";

