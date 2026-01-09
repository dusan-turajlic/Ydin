import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom } from "@/atoms/onboarding";

/**
 * Dumbbell icon
 */
function DumbbellIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
        >
            <path d="m6.5 6.5 11 11" />
            <path d="m21 21-1-1" />
            <path d="m3 3 1 1" />
            <path d="m18 22 4-4" />
            <path d="m2 6 4-4" />
            <path d="m3 10 7-7" />
            <path d="m14 21 7-7" />
        </svg>
    );
}

const SESSION_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

export function Training() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);

    const handleSelect = (sessions: number) => {
        setWizardData((prev) => ({ ...prev, strengthSessionsPerWeek: sessions }));
    };

    const handleNext = () => {
        navigate("/setup/goal");
    };

    return (
        <WizardLayout currentStep={3} totalSteps={4}>
            {/* Content */}
            <div className="flex-1 pt-4">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6">
                    <DumbbellIcon />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Strength Training
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-8">
                    How many times per week do you do strength/resistance training? This helps us factor in additional calorie burn.
                </p>

                {/* Session selector */}
                <div className="space-y-3">
                    {SESSION_OPTIONS.map((sessions) => {
                        const isSelected = wizardData.strengthSessionsPerWeek === sessions;
                        const label =
                            sessions === 0
                                ? "I don't strength train"
                                : sessions === 1
                                ? "1 session per week"
                                : `${sessions} sessions per week`;

                        return (
                            <button
                                key={sessions}
                                type="button"
                                onClick={() => handleSelect(sessions)}
                                className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                                    isSelected
                                        ? "bg-surface border-2 border-gold"
                                        : "bg-surface border border-border hover:border-gold/50"
                                }`}
                            >
                                <span
                                    className={`font-medium ${
                                        isSelected ? "text-foreground" : "text-foreground-secondary"
                                    }`}
                                >
                                    {label}
                                </span>

                                {/* Radio indicator */}
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        isSelected
                                            ? "border-gold bg-gold"
                                            : "border-foreground-secondary"
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-background" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Info hint */}
                <p className="mt-6 text-sm text-foreground-secondary">
                    Each session adds approximately 400 kcal to your weekly expenditure (distributed daily).
                </p>
            </div>

            {/* Footer */}
            <div className="py-6">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleNext}
                >
                    Next
                    <ArrowRightIcon />
                </Button>
            </div>
        </WizardLayout>
    );
}

export default Training;

