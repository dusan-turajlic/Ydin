import { atom } from "jotai";

/**
 * Daily nutrition targets for the user
 * Hardcoded for now - can later be persisted/customized
 */
export const targetsAtom = atom({
    // Main macros
    calories: 2400,
    protein: 200,
    fat: 90,
    carbs: 225,

    // Carb breakdown
    fiber: 25,
    sugars: 50,
    starch: 150,

    // Fat breakdown
    saturated: 10,
    monounsaturated: 20,
    polyunsaturated: 10,
    transFat: 0,
    omega3: 1.6,
    omega3Ala: 1,
    omega3Dha: 0.2,
    omega3Epa: 0.25,
    omega6: 10,

    // Vitamins (mg or μg as noted)
    vitaminA: 900,      // μg
    vitaminC: 90,       // mg
    vitaminD: 4,        // μg
    vitaminE: 15,       // mg
    vitaminK: 90,       // μg
    thiamine: 1.2,      // mg (B1)
    riboflavin: 1,      // mg (B2)
    niacin: 16,         // mg (B3)
    pantothenicAcid: 5, // mg (B5)
    vitaminB6: 1.3,     // mg
    biotin: 4,          // mg (B7)
    folate: 400,        // μg

    // Minerals
    calcium: 1000,      // mg
    copper: 0.9,        // mg
    iron: 8,            // mg
    magnesium: 420,     // mg
    manganese: 2.3,     // mg
    phosphorus: 700,    // mg
    potassium: 4500,    // mg
    selenium: 70,       // μg
    sodium: 2000,       // mg
    zinc: 11,           // mg

    // Other
    water: 3000,        // g
    caffeine: 400,      // mg
    cholesterol: 300,   // mg
    alcohol: 0,         // g
});

export type DailyTargets = ReturnType<typeof targetsAtom["read"]>;

