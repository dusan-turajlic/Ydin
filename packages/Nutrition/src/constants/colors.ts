/**
 * Nutrient category colors for the nutrition UI
 * All colors are Tailwind CSS classes for easy theming
 * Change these values to update colors across all nutrition components
 */

export const NUTRIENT_COLORS = {
    // Main macros
    calories: "bg-gold",
    protein: "bg-emerald-500",
    fat: "bg-amber-500",
    carbs: "bg-sky-500",

    // Carb breakdown
    fiber: "bg-green-600",
    sugars: "bg-pink-400",
    starch: "bg-indigo-400",

    // Fat breakdown
    saturated: "bg-orange-500",
    monounsaturated: "bg-yellow-500",
    polyunsaturated: "bg-lime-500",
    transFat: "bg-red-500",
    omega3: "bg-cyan-500",
    omega6: "bg-teal-500",

    // Vitamins
    vitamins: "bg-violet-500",

    // Minerals
    minerals: "bg-slate-400",

    // Other
    other: "bg-zinc-500",
    water: "bg-blue-400",
    caffeine: "bg-amber-700",
    alcohol: "bg-rose-600",
    cholesterol: "bg-orange-400",
} as const;

export type NutrientColorKey = keyof typeof NUTRIENT_COLORS;

/**
 * Text color variants for badges and labels
 * These pair with the background colors above
 */
export const NUTRIENT_TEXT_COLORS = {
    calories: "text-gold",
    protein: "text-emerald-500",
    fat: "text-amber-500",
    carbs: "text-sky-500",
    fiber: "text-green-600",
    vitamins: "text-violet-500",
    minerals: "text-slate-400",
    other: "text-zinc-500",
} as const;

