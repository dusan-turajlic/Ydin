/**
 * Serving - Static utility class for serving size calculations.
 * Handles scaling macros and generating preset options.
 */
import type { MacroValues } from "@/modals";

/**
 * Scaled macro values with calculated calories
 */
export interface ScaledMacros {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sugars: number;
}

// Calorie constants for macro calculation
const PROTEIN_CALORIES_PER_GRAM = 4;
const FAT_CALORIES_PER_GRAM = 9;
const CARBS_CALORIES_PER_GRAM = 4;

export class Serving {
    // ─────────────────────────────────────────────────────────────
    // Macro Calculations
    // ─────────────────────────────────────────────────────────────

    /**
     * Scale macros from per100g values to a given serving size in grams.
     * @param per100g - Macro values per 100g
     * @param servingGrams - Target serving size in grams
     * @returns Scaled macro values
     */
    static scaleMacros(per100g: MacroValues | undefined, servingGrams: number): ScaledMacros {
        const multiplier = servingGrams / 100;

        const protein = (per100g?.proteins ?? 0) * multiplier;
        const fat = (per100g?.fat ?? 0) * multiplier;
        const carbs = (per100g?.carbohydrates ?? 0) * multiplier;
        const fiber = (per100g?.fiber ?? 0) * multiplier;
        const sugars = (per100g?.sugars ?? 0) * multiplier;

        // Use energy_kcal if available, otherwise calculate from macros
        const calories = per100g?.energy_kcal
            ? per100g.energy_kcal * multiplier
            : Serving.calculateCalories({ protein, fat, carbs });

        return {
            calories,
            protein,
            fat,
            carbs,
            fiber,
            sugars,
        };
    }

    /**
     * Calculate calories from macronutrients using 4-9-4 rule.
     */
    static calculateCalories(macros: { protein: number; fat: number; carbs: number }): number {
        return (
            macros.protein * PROTEIN_CALORIES_PER_GRAM +
            macros.fat * FAT_CALORIES_PER_GRAM +
            macros.carbs * CARBS_CALORIES_PER_GRAM
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Preset Options
    // ─────────────────────────────────────────────────────────────

    /**
     * Get preset serving size options for quick selection badges.
     * Always includes 1g and 100g. Adds product serving size if different.
     * @param productServingSize - The product's default serving size (optional)
     * @returns Array of preset values in grams, sorted ascending
     */
    static getPresets(productServingSize?: number | null): number[] {
        const presets = new Set<number>([1, 100]);

        if (productServingSize && productServingSize > 0 && productServingSize !== 100) {
            presets.add(Math.round(productServingSize));
        }

        return Array.from(presets).sort((a, b) => a - b);
    }

    // ─────────────────────────────────────────────────────────────
    // Validation
    // ─────────────────────────────────────────────────────────────

    /**
     * Clamp serving size to valid range (minimum 1g).
     * @param value - Input serving size
     * @returns Clamped value (at least 1)
     */
    static clamp(value: number): number {
        return Math.max(1, Math.round(value));
    }
}

