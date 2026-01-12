import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout } from "./WizardLayout";
import { wizardDataAtom } from "@/atoms/onboarding";
import { createSettings } from "@/services/storage/targets";
import { calculateFromProfile, recalculateTargets, type CalculationResult } from "@/utils/ree";

/**
 * Flame icon for calorie goal
 */
function FlameIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
        >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
    );
}

/**
 * Trend icon for recommendation
 */
function TrendIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    );
}

const MIN_CALORIES = 1200;
const MAX_CALORIES = 4000;

export function Goal() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate recommended calories from profile data
    const calculation: CalculationResult | null = useMemo(() => {
        if (
            wizardData.age === null ||
            wizardData.height === null ||
            wizardData.weight === null ||
            wizardData.biologicalProfile === null ||
            wizardData.averageDailySteps === null
        ) {
            return null;
        }

        return calculateFromProfile({
            age: wizardData.age,
            height: wizardData.height,
            heightUnit: wizardData.heightUnit,
            weight: wizardData.weight,
            weightUnit: wizardData.weightUnit,
            biologicalProfile: wizardData.biologicalProfile,
            averageDailySteps: wizardData.averageDailySteps,
            strengthSessionsPerWeek: wizardData.strengthSessionsPerWeek,
        });
    }, [wizardData]);

    // Initialize calories from calculation
    const [calories, setCalories] = useState<number>(
        wizardData.dailyCalories ?? calculation?.recommendedCalories ?? 2000
    );

    useEffect(() => {
        if (wizardData.dailyCalories === null && calculation) {
            setCalories(calculation.recommendedCalories);
        }
    }, [calculation, wizardData.dailyCalories]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setCalories(value);
    };

    const handleSave = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Calculate final targets
            const targets = recalculateTargets(
                calories,
                wizardData.weight!,
                wizardData.weightUnit
            );

            // Save to storage
            await createSettings({
                setupMode: "guided",
                profile: {
                    age: wizardData.age!,
                    height: wizardData.height!,
                    heightUnit: wizardData.heightUnit,
                    weight: wizardData.weight!,
                    weightUnit: wizardData.weightUnit,
                    biologicalProfile: wizardData.biologicalProfile!,
                },
                activity: {
                    averageDailySteps: wizardData.averageDailySteps!,
                    strengthSessionsPerWeek: wizardData.strengthSessionsPerWeek,
                },
                countryCode: wizardData.countryCode!,
                calorieStrategy: "same",
                targets,
            });

            // Navigate to main app
            navigate("/food", { replace: true });
        } catch (error) {
            console.error("Failed to save settings:", error);
            setIsSubmitting(false);
        }
    };

    // Calculate slider position for thumb styling
    const sliderPercent = ((calories - MIN_CALORIES) / (MAX_CALORIES - MIN_CALORIES)) * 100;

    return (
        <WizardLayout currentStep={4} totalSteps={4}>
            {/* Content */}
            <div className="flex-1 pt-8 flex flex-col items-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6">
                    <FlameIcon />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3 text-center">
                    Daily Calorie Goal
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary text-center max-w-sm mb-12">
                    Set a consistent daily target. We'll automatically adjust your protein, carb, and fat goals.
                </p>

                {/* Large calorie display */}
                <div className="mb-8">
                    <div className="text-center border-2 border-border rounded-2xl px-12 py-8">
                        <span className="text-7xl font-bold text-foreground">
                            {calories.toLocaleString()}
                        </span>
                        <p className="text-sm text-foreground-secondary uppercase tracking-wider mt-2">
                            KCAL / DAY
                        </p>
                    </div>
                </div>

                {/* Slider */}
                <div className="w-full max-w-sm mb-8">
                    <input
                        type="range"
                        min={MIN_CALORIES}
                        max={MAX_CALORIES}
                        step={50}
                        value={calories}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
                        style={{
                            background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${sliderPercent}%, var(--muted) ${sliderPercent}%, var(--muted) 100%)`,
                        }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-foreground-secondary">
                        <span>{MIN_CALORIES.toLocaleString()}</span>
                        <span>2600</span>
                        <span>{MAX_CALORIES.toLocaleString()}+</span>
                    </div>
                </div>

                {/* Recommendation card */}
                {calculation && (
                    <div className="w-full max-w-sm p-4 rounded-xl bg-surface flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <TrendIcon />
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground">
                                Recommended: {calculation.recommendedCalories.toLocaleString()} kcal
                            </h3>
                            <p className="text-sm text-foreground-secondary mt-0.5">
                                Based on your activity level, this target puts you in a mild deficit for sustainable progress.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="py-6">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleSave}
                    isDisabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save Goal"}
                </Button>
            </div>
        </WizardLayout>
    );
}

export default Goal;

