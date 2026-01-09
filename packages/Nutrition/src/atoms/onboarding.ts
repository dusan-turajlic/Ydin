import { atom } from "jotai";
import type {
    BiologicalProfile,
    HeightUnit,
    WeightUnit,
    SetupMode,
    DailyTargets,
} from "@/services/storage/targets";

// Re-export types for convenience
export type { BiologicalProfile, HeightUnit, WeightUnit, SetupMode };

/**
 * Wizard form data structure
 * Accumulated as user progresses through steps
 */
export interface WizardData {
    // Mode selection
    setupMode: SetupMode | null;

    // Measurements
    age: number | null;
    height: number | null;
    heightUnit: HeightUnit;
    weight: number | null;
    weightUnit: WeightUnit;

    // Profile
    biologicalProfile: BiologicalProfile | null;

    // Activity
    averageDailySteps: number | null;
    strengthSessionsPerWeek: number;

    // Goal (calculated or adjusted)
    dailyCalories: number | null;

    // Country
    countryCode: string | null;

    // Manual mode targets (when setupMode === 'manual')
    manualTargets: DailyTargets | null;
}

/**
 * Default wizard data
 */
const defaultWizardData: WizardData = {
    setupMode: null,
    age: null,
    height: null,
    heightUnit: "cm",
    weight: null,
    weightUnit: "kg",
    biologicalProfile: null,
    averageDailySteps: null,
    strengthSessionsPerWeek: 0,
    dailyCalories: null,
    countryCode: null,
    manualTargets: null,
};

/**
 * Main wizard data atom
 * Persists form state across wizard steps
 */
export const wizardDataAtom = atom<WizardData>(defaultWizardData);

/**
 * Reset wizard data to defaults
 */
export const resetWizardAtom = atom(null, (_get, set) => {
    set(wizardDataAtom, defaultWizardData);
});

/**
 * Check if measurements step is complete
 */
export const isMeasurementsCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);
    return data.age !== null && data.height !== null && data.weight !== null;
});

/**
 * Check if profile step is complete
 */
export const isProfileCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);
    return data.biologicalProfile !== null;
});

/**
 * Check if activity step is complete
 */
export const isActivityCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);
    return data.averageDailySteps !== null;
});

/**
 * Check if goal step is complete
 */
export const isGoalCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);
    return data.dailyCalories !== null;
});

/**
 * Check if country step is complete
 */
export const isCountryCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);
    return data.countryCode !== null;
});

/**
 * Check if manual setup is complete
 */
export const isManualCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);
    return data.manualTargets !== null;
});

/**
 * Check if entire wizard is complete (guided path)
 */
export const isWizardCompleteAtom = atom((get) => {
    const data = get(wizardDataAtom);

    if (data.setupMode === "manual") {
        return data.manualTargets !== null && data.countryCode !== null;
    }

    return (
        data.age !== null &&
        data.height !== null &&
        data.weight !== null &&
        data.biologicalProfile !== null &&
        data.averageDailySteps !== null &&
        data.dailyCalories !== null &&
        data.countryCode !== null
    );
});

