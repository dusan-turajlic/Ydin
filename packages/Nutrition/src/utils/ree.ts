import type { BiologicalProfile, HeightUnit, WeightUnit, DailyTargets } from "@/services/storage/targets";

/**
 * Convert height to centimeters
 */
export function toHeightCm(height: number, unit: HeightUnit): number {
    if (unit === "cm") return height;
    // Convert feet to cm (1 foot = 30.48 cm)
    return height * 30.48;
}

/**
 * Convert weight to kilograms
 */
export function toWeightKg(weight: number, unit: WeightUnit): number {
    if (unit === "kg") return weight;
    // Convert lbs to kg (1 lb = 0.453592 kg)
    return weight * 0.453592;
}

/**
 * Calculate REE (Resting Energy Expenditure) using Mifflin-St Jeor equation
 *
 * XY profile (male): REE = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * XX profile (female): REE = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */
export function calculateREE(
    weightKg: number,
    heightCm: number,
    age: number,
    profile: BiologicalProfile
): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

    if (profile === "XY") {
        return base + 5;
    }
    return base - 161;
}

/**
 * Calculate calories burned from steps
 * Average: ~0.04 kcal per step
 */
export function calculateStepCalories(dailySteps: number): number {
    return Math.round(dailySteps * 0.04);
}

/**
 * Calculate calories burned from strength training
 * Average: ~400 kcal per session (middle of 300-500 range)
 * Distributed across the week
 */
export function calculateTrainingCalories(sessionsPerWeek: number): number {
    const caloriesPerSession = 400;
    const totalWeeklyCalories = sessionsPerWeek * caloriesPerSession;
    // Return daily average
    return Math.round(totalWeeklyCalories / 7);
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * REE + step calories + training calories
 */
export function calculateTDEE(
    weightKg: number,
    heightCm: number,
    age: number,
    profile: BiologicalProfile,
    dailySteps: number,
    strengthSessionsPerWeek: number
): number {
    const ree = calculateREE(weightKg, heightCm, age, profile);
    const stepCalories = calculateStepCalories(dailySteps);
    const trainingCalories = calculateTrainingCalories(strengthSessionsPerWeek);

    return Math.round(ree + stepCalories + trainingCalories);
}

/**
 * Protein grams per calorie (4 kcal per gram)
 */
const PROTEIN_KCAL_PER_GRAM = 4;

/**
 * Fat grams per calorie (9 kcal per gram)
 */
const FAT_KCAL_PER_GRAM = 9;

/**
 * Carbs grams per calorie (4 kcal per gram)
 */
const CARBS_KCAL_PER_GRAM = 4;

/**
 * Protein target: 2.2g per kg body weight (high protein for muscle building/retention)
 */
const PROTEIN_GRAMS_PER_KG = 2.2;

/**
 * Minimum fat percentage of total calories (30%)
 */
const MIN_FAT_PERCENTAGE = 0.30;

/**
 * Default fiber target in grams
 */
const DEFAULT_FIBER_GRAMS = 30;

/**
 * Calculate macro targets from calorie goal and body weight
 *
 * Strategy:
 * 1. Protein: 2.2g per kg body weight
 * 2. Fat: Minimum 30% of total calories
 * 3. Carbs: Remaining calories after protein + fat
 */
export function calculateMacros(
    calories: number,
    weightKg: number
): Pick<DailyTargets, "protein" | "fat" | "carbs" | "fiber"> {
    // Calculate protein (2.2g per kg)
    const proteinGrams = Math.round(weightKg * PROTEIN_GRAMS_PER_KG);
    const proteinCalories = proteinGrams * PROTEIN_KCAL_PER_GRAM;

    // Calculate minimum fat (30% of total calories)
    const minFatCalories = calories * MIN_FAT_PERCENTAGE;
    const fatGrams = Math.round(minFatCalories / FAT_KCAL_PER_GRAM);
    const fatCalories = fatGrams * FAT_KCAL_PER_GRAM;

    // Remaining calories go to carbs
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbGrams = Math.max(0, Math.round(remainingCalories / CARBS_KCAL_PER_GRAM));

    return {
        protein: proteinGrams,
        fat: fatGrams,
        carbs: carbGrams,
        fiber: DEFAULT_FIBER_GRAMS,
    };
}

/**
 * Build complete daily targets from user inputs
 */
export function buildDailyTargets(
    calories: number,
    weightKg: number
): DailyTargets {
    const macros = calculateMacros(calories, weightKg);

    return {
        calories,
        ...macros,
    };
}

/**
 * Full calculation pipeline from user profile to targets
 */
export interface CalculationInput {
    age: number;
    height: number;
    heightUnit: HeightUnit;
    weight: number;
    weightUnit: WeightUnit;
    biologicalProfile: BiologicalProfile;
    averageDailySteps: number;
    strengthSessionsPerWeek: number;
}

export interface CalculationResult {
    ree: number;
    stepCalories: number;
    trainingCalories: number;
    tdee: number;
    recommendedCalories: number;
    targets: DailyTargets;
}

/**
 * Calculate everything from user profile
 */
export function calculateFromProfile(input: CalculationInput): CalculationResult {
    const heightCm = toHeightCm(input.height, input.heightUnit);
    const weightKg = toWeightKg(input.weight, input.weightUnit);

    const ree = calculateREE(weightKg, heightCm, input.age, input.biologicalProfile);
    const stepCalories = calculateStepCalories(input.averageDailySteps);
    const trainingCalories = calculateTrainingCalories(input.strengthSessionsPerWeek);
    const tdee = Math.round(ree + stepCalories + trainingCalories);

    // Recommended calories = TDEE (maintenance)
    // User can adjust this on the goal screen
    const recommendedCalories = tdee;

    const targets = buildDailyTargets(recommendedCalories, weightKg);

    return {
        ree: Math.round(ree),
        stepCalories,
        trainingCalories,
        tdee,
        recommendedCalories,
        targets,
    };
}

/**
 * Recalculate targets when user adjusts calorie goal
 */
export function recalculateTargets(
    calories: number,
    weight: number,
    weightUnit: WeightUnit
): DailyTargets {
    const weightKg = toWeightKg(weight, weightUnit);
    return buildDailyTargets(calories, weightKg);
}

