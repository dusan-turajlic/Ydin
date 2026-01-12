import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button, Input, SegmentedControl } from "@ydin/design-system";
import { WizardLayout, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom, type HeightUnit, type WeightUnit } from "@/atoms/onboarding";

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

    const handleNumericChange = (
        field: "age" | "height" | "weight",
        value: string
    ) => {
        if (value === "") {
            updateField(field, null);
            return;
        }
        const num = Number.parseFloat(value);
        if (!Number.isNaN(num)) {
            updateField(field, num);
        }
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
                <div className="space-y-6">
                    {/* Age */}
                    <Input
                        type="number"
                        size="xl"
                        label="Age"
                        labelClassName="ml-3 text-xl font-medium text-accent"
                        value={wizardData.age?.toString() ?? ""}
                        onChange={(value) => handleNumericChange("age", value)}
                        placeholder="0"
                        endAdornment={
                            <span className="text-foreground-secondary px-2">years</span>
                        }
                    />

                    {/* Height */}
                    <div className="space-y-6 relative">
                        <div className="flex items-center justify-between absolute -top-2 right-0">
                            <SegmentedControl<HeightUnit>
                                size="sm"
                                aria-label="Height unit"
                                options={[
                                    { value: "cm", label: "CM" },
                                    { value: "ft", label: "FT" },
                                ]}
                                value={wizardData.heightUnit}
                                onChange={(v) => updateField("heightUnit", v)}
                            />
                        </div>
                        <Input
                            type="number"
                            size="xl"
                            label="Height"
                            labelClassName="ml-3 text-xl font-medium text-accent"
                            value={wizardData.height?.toString() ?? ""}
                            onChange={(value) => handleNumericChange("height", value)}
                            placeholder="0"
                            endAdornment={
                                <span className="text-foreground-secondary px-2">
                                    {wizardData.heightUnit}
                                </span>
                            }
                        />
                    </div>

                    {/* Weight */}
                    <div className="space-y-6 relative">
                        <div className="flex items-center justify-between absolute -top-2 right-0">
                            <SegmentedControl<WeightUnit>
                                size="sm"
                                aria-label="Weight unit"
                                options={[
                                    { value: "lbs", label: "LBS" },
                                    { value: "kg", label: "KG" },
                                ]}
                                value={wizardData.weightUnit}
                                onChange={(v) => updateField("weightUnit", v)}
                            />
                        </div>
                        <Input
                            type="number"
                            size="xl"
                            label="Weight"
                            labelClassName="ml-3 text-xl font-medium text-accent"
                            value={wizardData.weight?.toString() ?? ""}
                            onChange={(value) => handleNumericChange("weight", value)}
                            placeholder="0"
                            endAdornment={
                                <span className="text-foreground-secondary px-2">
                                    {wizardData.weightUnit}
                                </span>
                            }
                        />
                    </div>
                </div>

                {/* Info hint */}
                <div className="mt-8 p-4 rounded-xl bg-surface flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-foreground-secondary">i</span>
                    </div>
                    <p className="text-sm text-foreground-secondary">
                        This information is used to calculate your basal metabolic rate (BMR). Simply put, it's how much energy your body needs to just keep the lights on.
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
