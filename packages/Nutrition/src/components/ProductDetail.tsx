import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    ProgressIndicator,
    Button,
    MacroBadge,
    CollapsibleSection,
    NutrientRow,
} from "@ydin/design-system";
import { Plus, Minus } from "@ydin/design-system/icons";
import { getByBarcode } from "@/services/api/openFoodDex";
import type { Product } from "@/modals";
import { extractMacros, calculateCaloriesFromMacros, calculatePercentageOfTarget } from "@/utils/macros";
import { LoadingSpinner } from "@/components/ui";
import { useSheetContentHeight } from "@/hooks/useSheetContentHeight";
import { NUTRIENT_COLORS } from "@/constants/colors";
import { targetsAtom } from "@/atoms/targets";
import { addFoodEntryAtom } from "@/atoms/day";
import { logHourAtom } from "@/atoms/time";
import { sheetExpandedAtom } from "@/atoms/sheet";
import { addItem as addDiaryItem } from "@/services/storage/diary";
import { Day } from "@/domain";

interface ProductDetailProps {
    code: string;
}

export default function ProductDetail({ code }: Readonly<ProductDetailProps>) {
    const navigate = useNavigate();
    const targets = useAtomValue(targetsAtom);
    const addFoodEntry = useSetAtom(addFoodEntryAtom);
    const [logHour, setLogHour] = useAtom(logHourAtom);
    const setIsExpanded = useSetAtom(sheetExpandedAtom);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [servingCount, setServingCount] = useState(1);
    const sheetHeight = useSheetContentHeight({ percentage: 0.75 });

    useEffect(() => {
        async function fetchProduct() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getByBarcode(code);
                setProduct(data);
            } catch (err) {
                setError("Failed to load product");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [code]);

    const handleLogFood = async () => {
        if (!product) return;

        // Get today's date
        const today = Day.today();

        const entryData = {
            code: product.code,
            name: product.product_name ?? "Unknown",
            servingCount,
            servingSize: product.macros?.serving_size ?? 100,
            unit: product.macros?.serving_unit ?? "g",
            macros: {
                calories: macros.calories,
                protein: macros.protein,
                fat: macros.fat,
                carbs: macros.carbs,
                fiber: macros.fiber,
                sugars: macros.sugars,
            },
        };

        // Persist to database
        await addDiaryItem(today, logHour, entryData);

        // Update in-memory state for immediate UI feedback
        addFoodEntry({
            ...entryData,
            time: today.atHour(logHour),
        });

        setLogHour(null);
        setIsExpanded(false);
        navigate("/food");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12" style={{ height: sheetHeight }}>
                <LoadingSpinner show={true} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center text-foreground-secondary py-12" style={{ height: sheetHeight }}>
                <span className="text-4xl mb-2">😕</span>
                <p>{error ?? "Product not found"}</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/food")}
                >
                    Go back
                </Button>
            </div>
        );
    }

    // Extract macros from product (default to 0 if missing)
    const rawMacros = extractMacros(product.macros?.per100g);
    const servingSize = product.macros?.serving_size ?? 100;
    const servingUnit = product.macros?.serving_unit ?? "g";
    const multiplier = (servingSize / 100) * servingCount;

    // Calculate values based on serving
    const getValue = (value: number) => value * multiplier;

    const macros = {
        calories: getValue(rawMacros.calories || calculateCaloriesFromMacros({
            protein: rawMacros.protein,
            fat: rawMacros.fat,
            carbs: rawMacros.carbs,
        })),
        protein: getValue(rawMacros.protein),
        fat: getValue(rawMacros.fat),
        carbs: getValue(rawMacros.carbs),
        fiber: getValue(rawMacros.fiber),
        sugars: getValue(rawMacros.sugars),
    };

    // Calculate percentages of daily targets
    const getPercentage = (value: number, target: number) =>
        calculatePercentageOfTarget(value, target);

    // Serving info
    const totalServing = Math.round(servingSize * servingCount);

    return (
        <div className="flex flex-col" style={{ height: sheetHeight }}>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pb-4">
                {/* Header with back button and product name */}
                <div className="flex items-start gap-3 mb-4">
                    <h1 className="text-xl font-bold text-foreground capitalize flex-1">
                        {product.product_name ?? "Unknown Product"}
                    </h1>
                </div>

                {/* Macro Summary Row */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <MacroBadge
                        value={Math.round(macros.calories)}
                        label="Cal"
                        color={NUTRIENT_COLORS.calories}
                    />
                    <MacroBadge
                        value={macros.fat}
                        label="Fat"
                        unit="g"
                        color={NUTRIENT_COLORS.fat}
                    />
                    <MacroBadge
                        value={macros.carbs}
                        label="Carbs"
                        unit="g"
                        color={NUTRIENT_COLORS.carbs}
                    />
                    <MacroBadge
                        value={macros.protein}
                        label="Prot"
                        unit="g"
                        color={NUTRIENT_COLORS.protein}
                    />
                </div>

                {/* Impact on Targets */}
                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-foreground mb-3">Impact on Targets</h2>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-foreground-secondary text-center">
                                {getPercentage(macros.calories, targets.calories)}%
                            </span>
                            <ProgressIndicator
                                value={macros.calories}
                                max={targets.calories}
                                size="sm"
                                color={NUTRIENT_COLORS.calories}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-foreground-secondary text-center">
                                {getPercentage(macros.protein, targets.protein)}%
                            </span>
                            <ProgressIndicator
                                value={macros.protein}
                                max={targets.protein}
                                size="sm"
                                color={NUTRIENT_COLORS.protein}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-foreground-secondary text-center">
                                {getPercentage(macros.fat, targets.fat)}%
                            </span>
                            <ProgressIndicator
                                value={macros.fat}
                                max={targets.fat}
                                size="sm"
                                color={NUTRIENT_COLORS.fat}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-foreground-secondary text-center">
                                {getPercentage(macros.carbs, targets.carbs)}%
                            </span>
                            <ProgressIndicator
                                value={macros.carbs}
                                max={targets.carbs}
                                size="sm"
                                color={NUTRIENT_COLORS.carbs}
                            />
                        </div>
                    </div>
                </div>

                {/* Carb Breakdown */}
                <CollapsibleSection title="Carb Breakdown" defaultOpen>
                    <NutrientRow label="Carbs" value={macros.carbs} target={targets.carbs} unit="g" color={NUTRIENT_COLORS.carbs} />
                    <NutrientRow label="Fiber" value={macros.fiber} target={targets.fiber} unit="g" color={NUTRIENT_COLORS.fiber} />
                    <NutrientRow label="Net (Non-fiber)" value={macros.carbs - macros.fiber} unit="g" />
                    <NutrientRow label="Starch" value={0} unit="g" />
                    <NutrientRow label="Sugars" value={macros.sugars} unit="g" />
                    <NutrientRow label="Sugars Added" value={0} unit="g" />
                </CollapsibleSection>

                {/* Fat Breakdown */}
                <CollapsibleSection title="Fat Breakdown" defaultOpen>
                    <NutrientRow label="Fat" value={macros.fat} target={targets.fat} unit="g" color={NUTRIENT_COLORS.fat} />
                    <NutrientRow label="Monounsaturated" value={0} unit="g" />
                    <NutrientRow label="Polyunsaturated" value={0} unit="g" />
                    <NutrientRow label="Omega-3" value={0} target={targets.omega3} unit="g" color={NUTRIENT_COLORS.omega3} />
                    <NutrientRow label="Omega-3 ALA" value={0} target={targets.omega3Ala} unit="g" color={NUTRIENT_COLORS.omega3} />
                    <NutrientRow label="Omega-3 DHA" value={0} target={targets.omega3Dha} unit="g" color={NUTRIENT_COLORS.omega3} />
                    <NutrientRow label="Omega-3 EPA" value={0} target={targets.omega3Epa} unit="g" color={NUTRIENT_COLORS.omega3} />
                    <NutrientRow label="Omega-6" value={0} unit="g" />
                    <NutrientRow label="Saturated" value={0} target={targets.saturated} unit="g" color={NUTRIENT_COLORS.saturated} />
                    <NutrientRow label="Trans Fat" value={0} target={targets.transFat} unit="g" color={NUTRIENT_COLORS.transFat} />
                </CollapsibleSection>

                {/* Protein Breakdown */}
                <CollapsibleSection title="Protein Breakdown" defaultOpen>
                    <NutrientRow label="Protein" value={macros.protein} target={targets.protein} unit="g" color={NUTRIENT_COLORS.protein} />
                    <NutrientRow label="Cystine" value={0} unit="g" />
                    <NutrientRow label="Histidine" value={0} unit="g" />
                    <NutrientRow label="Isoleucine" value={0} unit="g" />
                    <NutrientRow label="Leucine" value={0} unit="g" />
                    <NutrientRow label="Lysine" value={0} unit="g" />
                    <NutrientRow label="Methionine" value={0} unit="g" />
                    <NutrientRow label="Phenylalanine" value={0} unit="g" />
                    <NutrientRow label="Threonine" value={0} unit="g" />
                    <NutrientRow label="Tryptophan" value={0} unit="g" />
                    <NutrientRow label="Tyrosine" value={0} unit="g" />
                    <NutrientRow label="Valine" value={0} unit="g" />
                </CollapsibleSection>

                {/* Vitamins */}
                <CollapsibleSection title="Vitamins" defaultOpen>
                    <NutrientRow label="B1 Thiamine" value={0} target={targets.thiamine} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="B2 Riboflavin" value={0} target={targets.riboflavin} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="B3 Niacin" value={0} target={targets.niacin} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="B5 Pantothenic Acid" value={0} target={targets.pantothenicAcid} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="B6 Pyridoxine" value={0} target={targets.vitaminB6} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="B7 Choline/Biotin" value={0} target={targets.biotin} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="Folate" value={0} target={targets.folate} unit="μg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="Vitamin A" value={0} target={targets.vitaminA} unit="μg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="Vitamin C" value={0} target={targets.vitaminC} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="Vitamin D" value={0} target={targets.vitaminD} unit="μg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="Vitamin E" value={0} target={targets.vitaminE} unit="mg" color={NUTRIENT_COLORS.vitamins} />
                    <NutrientRow label="Vitamin K" value={0} target={targets.vitaminK} unit="μg" color={NUTRIENT_COLORS.vitamins} />
                </CollapsibleSection>

                {/* Minerals */}
                <CollapsibleSection title="Minerals" defaultOpen>
                    <NutrientRow label="Calcium" value={0} target={targets.calcium} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Copper" value={0} target={targets.copper} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Iron" value={0} target={targets.iron} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Magnesium" value={0} target={targets.magnesium} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Manganese" value={0} target={targets.manganese} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Phosphorus" value={0} target={targets.phosphorus} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Potassium" value={0} target={targets.potassium} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Selenium" value={0} target={targets.selenium} unit="μg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Sodium" value={0} target={targets.sodium} unit="mg" color={NUTRIENT_COLORS.minerals} />
                    <NutrientRow label="Zinc" value={0} target={targets.zinc} unit="mg" color={NUTRIENT_COLORS.minerals} />
                </CollapsibleSection>

                {/* Other */}
                <CollapsibleSection title="Other" defaultOpen>
                    <NutrientRow label="Alcohol" value={0} unit="g" />
                    <NutrientRow label="Caffeine" value={0} target={targets.caffeine} unit="mg" color={NUTRIENT_COLORS.caffeine} />
                    <NutrientRow label="Cholesterol" value={0} target={targets.cholesterol} unit="mg" color={NUTRIENT_COLORS.cholesterol} />
                    <NutrientRow label="Water" value={0} target={targets.water} unit="g" color={NUTRIENT_COLORS.water} />
                </CollapsibleSection>
            </div>

            {/* Bottom Action Bar - Sticky */}
            <div className="flex items-center gap-3 pt-3 border-t border-border bg-surface">
                {/* Serving Counter */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setServingCount(Math.max(1, servingCount - 1))}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
                        disabled={servingCount <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-foreground">{servingCount}</span>
                    <button
                        type="button"
                        onClick={() => setServingCount(servingCount + 1)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                {/* Serving Info */}
                <div className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground truncate">
                    {product.product_name?.toLowerCase() ?? "serving"} • {totalServing} {servingUnit}
                </div>

                {/* Log Food Button */}
                <Button onClick={handleLogFood}>
                    Log Food
                </Button>
            </div>
        </div>
    );
}
