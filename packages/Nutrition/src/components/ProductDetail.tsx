import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import {
    ProgressIndicator,
    MacroBadge,
    CollapsibleSection,
    NutrientRow,
    Button,
} from "@ydin/design-system";
import { LoadingSpinner } from "@/components/ui";
import { NUTRIENT_COLORS } from "@/constants/colors";
import { targetsAtom } from "@/atoms/targets";
import { productAtomFamily, servingSizeAtom } from "@/atoms/selectedFood";
import { Serving } from "@/domain";
import { calculatePercentageOfTarget } from "@/utils/macros";

interface ProductDetailProps {
    code: string;
}

/**
 * Inner component that displays product details.
 * Wrapped in Suspense to handle async atom loading.
 */
function ProductDetailContent({ code }: Readonly<ProductDetailProps>) {
    const navigate = useNavigate();
    const targets = useAtomValue(targetsAtom);
    const product = useAtomValue(productAtomFamily(code));

    // Read serving size from shared atom (updated by ProductActionBar)
    const servingSize = useAtomValue(servingSizeAtom);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center text-foreground-secondary py-12 h-full">
                <span className="text-4xl mb-2">😕</span>
                <p>Product not found</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onPress={() => navigate("/food")}
                >
                    Go back
                </Button>
            </div>
        );
    }

    // Calculate macros based on current serving size from action bar
    const macros = Serving.scaleMacros(product.macros?.per100g, servingSize);

    // Calculate percentages of daily targets
    const getPercentage = (value: number, target: number) =>
        calculatePercentageOfTarget(value, target);

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pb-4">
                {/* Header with product name */}
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
        </div>
    );
}

/**
 * Product detail view with loading state handled by Suspense.
 */
export default function ProductDetail({ code }: Readonly<ProductDetailProps>) {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-12 h-full">
                    <LoadingSpinner show={true} />
                </div>
            }
        >
            <ProductDetailContent code={code} />
        </Suspense>
    );
}
