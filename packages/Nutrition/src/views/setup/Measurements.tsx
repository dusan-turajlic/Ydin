import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom, type HeightUnit, type WeightUnit } from "@/atoms/onboarding";

/**
 * Unit toggle component
 */
interface UnitToggleProps<T extends string> {
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}

function UnitToggle<T extends string>({
    options,
    value,
    onChange,
}: UnitToggleProps<T>) {
    return (
        <div className="flex bg-muted rounded-full p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        value === option.value
                            ? "bg-surface text-foreground"
                            : "text-foreground-secondary"
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

/**
 * Numeric input with large display
 */
interface NumericInputProps {
    label: string;
    value: number | null;
    onChange: (value: number | null) => void;
    unit?: string;
    unitToggle?: React.ReactNode;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}

function NumericInput({
    label,
    value,
    onChange,
    unit,
    unitToggle,
    placeholder = "0",
    min = 0,
    max = 999,
    step = 1,
}: NumericInputProps) {
    const [inputValue, setInputValue] = useState(value?.toString() ?? "");

    useEffect(() => {
        setInputValue(value?.toString() ?? "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);

        if (raw === "") {
            onChange(null);
            return;
        }

        const num = parseFloat(raw);
        if (!isNaN(num) && num >= min && num <= max) {
            onChange(num);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm text-gold uppercase tracking-wider font-medium">
                    {label}
                </label>
                {unitToggle}
            </div>
            <div className="flex items-center gap-3 border-b border-border pb-2">
                <input
                    type="number"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    className="flex-1 bg-transparent text-4xl font-semibold text-foreground placeholder:text-muted-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {unit && (
                    <span className="text-foreground-secondary text-lg">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

export function Measurements() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);

    const isComplete =
        wizardData.age !== null &&
        wizardData.height !== null &&
        wizardData.weight !== null;

    const handleNext = () => {
        if (isComplete) {
            navigate("/setup/profile");
        }
    };

    const updateField = <K extends keyof typeof wizardData>(
        field: K,
        value: (typeof wizardData)[K]
    ) => {
        setWizardData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <WizardLayout currentStep={1} totalSteps={4}>
            {/* Content */}
            <div className="flex-1 pt-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Your measurements
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-8">
                    Accurate details help us calculate your basal metabolic rate (BMR) and daily targets.
                </p>

                {/* Form */}
                <div className="space-y-8">
                    {/* Age */}
                    <NumericInput
                        label="Age"
                        value={wizardData.age}
                        onChange={(v) => updateField("age", v)}
                        unit="years"
                        min={13}
                        max={120}
                        step={1}
                    />

                    {/* Height */}
                    <NumericInput
                        label="Height"
                        value={wizardData.height}
                        onChange={(v) => updateField("height", v)}
                        unitToggle={
                            <UnitToggle<HeightUnit>
                                options={[
                                    { value: "cm", label: "CM" },
                                    { value: "ft", label: "FT" },
                                ]}
                                value={wizardData.heightUnit}
                                onChange={(v) => updateField("heightUnit", v)}
                            />
                        }
                        min={wizardData.heightUnit === "cm" ? 100 : 3}
                        max={wizardData.heightUnit === "cm" ? 250 : 8}
                        step={wizardData.heightUnit === "cm" ? 1 : 0.1}
                    />

                    {/* Weight */}
                    <NumericInput
                        label="Weight"
                        value={wizardData.weight}
                        onChange={(v) => updateField("weight", v)}
                        unitToggle={
                            <UnitToggle<WeightUnit>
                                options={[
                                    { value: "lbs", label: "LBS" },
                                    { value: "kg", label: "KG" },
                                ]}
                                value={wizardData.weightUnit}
                                onChange={(v) => updateField("weightUnit", v)}
                            />
                        }
                        min={wizardData.weightUnit === "kg" ? 30 : 66}
                        max={wizardData.weightUnit === "kg" ? 300 : 660}
                        step={0.1}
                    />
                </div>

                {/* Info hint */}
                <div className="mt-8 p-4 rounded-xl bg-surface flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-foreground-secondary">i</span>
                    </div>
                    <p className="text-sm text-foreground-secondary">
                        You can update these details anytime in your profile settings to adjust your macro goals.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="py-6">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleNext}
                    isDisabled={!isComplete}
                >
                    Next Step
                    <ArrowRightIcon />
                </Button>
            </div>
        </WizardLayout>
    );
}

export default Measurements;

