import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout, ArrowRightIcon, ChevronRightIcon } from "./WizardLayout";
import { wizardDataAtom } from "@/atoms/onboarding";
import { StepCountHelpModal } from "./modals/StepCountHelpModal";

/**
 * Question mark icon
 */
function QuestionIcon() {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
    );
}

export function Activity() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [inputValue, setInputValue] = useState(
        wizardData.averageDailySteps?.toString() ?? ""
    );

    useEffect(() => {
        setInputValue(wizardData.averageDailySteps?.toString() ?? "");
    }, [wizardData.averageDailySteps]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, "");
        setInputValue(raw);

        if (raw === "") {
            setWizardData((prev) => ({ ...prev, averageDailySteps: null }));
            return;
        }

        const num = parseInt(raw, 10);
        if (!isNaN(num) && num >= 0 && num <= 50000) {
            setWizardData((prev) => ({ ...prev, averageDailySteps: num }));
        }
    };

    // Format display value with commas
    const displayValue = inputValue
        ? parseInt(inputValue, 10).toLocaleString()
        : "";

    const handleNext = () => {
        if (wizardData.averageDailySteps !== null) {
            navigate("/setup/training");
        }
    };

    return (
        <WizardLayout currentStep={2} totalSteps={4}>
            {/* Content */}
            <div className="flex-1 pt-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Average Weekly Steps
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-12">
                    Your activity level is crucial for calculating your TDEE (Total Daily Energy Expenditure) accurately.
                </p>

                {/* Step count input */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-4 border-b border-gold pb-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={displayValue}
                            onChange={handleInputChange}
                            placeholder="7,500"
                            className="flex-1 bg-transparent text-5xl font-light text-foreground-secondary placeholder:text-muted-foreground outline-none"
                        />
                        <span className="text-foreground-secondary text-lg">
                            steps/day
                        </span>
                    </div>
                </div>

                {/* Help card */}
                <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="w-full p-4 rounded-xl bg-surface flex items-center gap-4 text-left hover:bg-muted transition-colors"
                >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <QuestionIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-0.5">
                            How to find this?
                        </h3>
                        <p className="text-sm text-foreground-secondary">
                            Check your phone's Health app (iOS) or Google Fit (Android) for your 7-day average.
                        </p>
                    </div>
                    <ChevronRightIcon className="text-foreground-secondary shrink-0" />
                </button>
            </div>

            {/* Footer */}
            <div className="py-6">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleNext}
                    isDisabled={wizardData.averageDailySteps === null}
                >
                    Next
                    <ArrowRightIcon />
                </Button>

                <p className="text-sm text-foreground-secondary text-center mt-4">
                    We use this data to tailor your calorie goals.
                </p>
            </div>

            {/* Help Modal */}
            <StepCountHelpModal
                isOpen={showHelpModal}
                onClose={() => setShowHelpModal(false)}
            />
        </WizardLayout>
    );
}

export default Activity;

