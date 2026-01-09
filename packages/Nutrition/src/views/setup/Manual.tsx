import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom } from "@/atoms/onboarding";
import type { DailyTargets } from "@/services/storage/targets";

/**
 * Macro input field
 */
interface MacroInputProps {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    unit: string;
    color?: string;
}

function MacroInput({
    label,
    value,
    onChange,
    unit,
    color = "text-gold",
}: MacroInputProps) {
    const [inputValue, setInputValue] = useState(value?.toString() ?? "");

    useEffect(() => {
        setInputValue(value?.toString() ?? "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);

        if (raw === "") {
            onChange(undefined);
            return;
        }

        const num = parseFloat(raw);
        if (!isNaN(num) && num >= 0) {
            onChange(num);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
            <label className={`font-medium ${color}`}>{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-20 bg-transparent text-right text-xl font-semibold text-foreground placeholder:text-muted-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-foreground-secondary w-8">
                    {unit}
                </span>
            </div>
        </div>
    );
}

export function Manual() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);

    const [targets, setTargets] = useState<Partial<DailyTargets>>({
        calories: wizardData.manualTargets?.calories,
        protein: wizardData.manualTargets?.protein,
        fat: wizardData.manualTargets?.fat,
        carbs: wizardData.manualTargets?.carbs,
        fiber: wizardData.manualTargets?.fiber ?? 30,
    });

    const updateTarget = (key: keyof DailyTargets, value: number | undefined) => {
        setTargets((prev) => ({ ...prev, [key]: value }));
    };

    const isComplete =
        targets.calories !== undefined &&
        targets.protein !== undefined &&
        targets.fat !== undefined &&
        targets.carbs !== undefined;

    const handleNext = () => {
        if (!isComplete) return;

        setWizardData((prev) => ({
            ...prev,
            manualTargets: {
                calories: targets.calories!,
                protein: targets.protein!,
                fat: targets.fat!,
                carbs: targets.carbs!,
                fiber: targets.fiber ?? 30,
            },
            dailyCalories: targets.calories!,
        }));

        navigate("/setup/country");
    };

    // Calculate macro calories
    const proteinCals = (targets.protein ?? 0) * 4;
    const fatCals = (targets.fat ?? 0) * 9;
    const carbsCals = (targets.carbs ?? 0) * 4;
    const totalMacroCals = proteinCals + fatCals + carbsCals;
    const calorieDiff = (targets.calories ?? 0) - totalMacroCals;

    return (
        <WizardLayout showProgress={false}>
            {/* Content */}
            <div className="flex-1 pt-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Set Your Targets
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-8">
                    Enter your daily calorie and macro goals. You can always adjust these later.
                </p>

                {/* Inputs */}
                <div className="space-y-3">
                    <MacroInput
                        label="Calories"
                        value={targets.calories}
                        onChange={(v) => updateTarget("calories", v)}
                        unit="kcal"
                        color="text-gold"
                    />

                    <div className="h-2" />

                    <MacroInput
                        label="Protein"
                        value={targets.protein}
                        onChange={(v) => updateTarget("protein", v)}
                        unit="g"
                        color="text-chart-blue"
                    />

                    <MacroInput
                        label="Fat"
                        value={targets.fat}
                        onChange={(v) => updateTarget("fat", v)}
                        unit="g"
                        color="text-chart-red"
                    />

                    <MacroInput
                        label="Carbs"
                        value={targets.carbs}
                        onChange={(v) => updateTarget("carbs", v)}
                        unit="g"
                        color="text-chart-green"
                    />

                    <MacroInput
                        label="Fiber"
                        value={targets.fiber}
                        onChange={(v) => updateTarget("fiber", v)}
                        unit="g"
                        color="text-foreground-secondary"
                    />
                </div>

                {/* Macro breakdown */}
                {isComplete && (
                    <div className="mt-6 p-4 rounded-xl bg-surface">
                        <h3 className="text-sm text-foreground-secondary mb-3">
                            Macro Breakdown
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-foreground-secondary">
                                    Protein ({targets.protein}g × 4)
                                </span>
                                <span className="text-foreground">
                                    {proteinCals} kcal
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground-secondary">
                                    Fat ({targets.fat}g × 9)
                                </span>
                                <span className="text-foreground">
                                    {fatCals} kcal
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground-secondary">
                                    Carbs ({targets.carbs}g × 4)
                                </span>
                                <span className="text-foreground">
                                    {carbsCals} kcal
                                </span>
                            </div>
                            <div className="border-t border-border pt-2 mt-2 flex justify-between font-medium">
                                <span className="text-foreground">Total</span>
                                <span
                                    className={
                                        Math.abs(calorieDiff) > 50
                                            ? "text-destructive"
                                            : "text-foreground"
                                    }
                                >
                                    {totalMacroCals} kcal
                                    {calorieDiff !== 0 && (
                                        <span className="text-foreground-secondary ml-1">
                                            ({calorieDiff > 0 ? "-" : "+"}
                                            {Math.abs(calorieDiff)})
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="py-6">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleNext}
                    isDisabled={!isComplete}
                >
                    Continue
                    <ArrowRightIcon />
                </Button>
            </div>
        </WizardLayout>
    );
}

export default Manual;

