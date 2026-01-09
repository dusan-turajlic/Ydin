/**
 * Biological profile for metabolic calculations
 * XY = Male hormonal/metabolic profile
 * XX = Female hormonal/metabolic profile
 */
export type BiologicalProfile = "XY" | "XX";

/**
 * Height unit preference
 */
export type HeightUnit = "cm" | "ft";

/**
 * Weight unit preference
 */
export type WeightUnit = "kg" | "lbs";

/**
 * Setup mode selection
 */
export type SetupMode = "guided" | "manual";

/**
 * Calorie strategy for daily targets
 */
export type CalorieStrategy = "same" | "variable";

/**
 * User's physical profile data
 */
export interface UserProfile {
    age: number;
    height: number;
    heightUnit: HeightUnit;
    weight: number;
    weightUnit: WeightUnit;
    biologicalProfile: BiologicalProfile;
}

/**
 * User's activity data
 */
export interface ActivityData {
    averageDailySteps: number;
    strengthSessionsPerWeek: number;
}

/**
 * Daily macro targets
 */
export interface DailyTargets {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    // Extended nutrients (optional)
    sugars?: number;
    saturated?: number;
    sodium?: number;
    // Add more as needed from the full targets atom
}

/**
 * Per-day targets for variable calorie strategy
 * Key is day of week (0 = Sunday, 6 = Saturday)
 */
export type PerDayTargets = Record<number, DailyTargets>;

/**
 * Complete user settings stored in the database
 */
export interface UserSettings {
    id: string;
    setupMode: SetupMode;
    profile: UserProfile;
    activity: ActivityData;
    countryCode: string;
    calorieStrategy: CalorieStrategy;
    targets: DailyTargets;
    perDayTargets?: PerDayTargets;
    setupComplete: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Input for creating user settings (without auto-generated fields)
 */
export interface CreateUserSettingsInput {
    setupMode: SetupMode;
    profile: UserProfile;
    activity: ActivityData;
    countryCode: string;
    calorieStrategy: CalorieStrategy;
    targets: DailyTargets;
    perDayTargets?: PerDayTargets;
}

/**
 * Input for updating user settings (all fields optional)
 */
export type UpdateUserSettingsInput = Partial<CreateUserSettingsInput>;

