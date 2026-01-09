import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { WizardLayout, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom, type SetupMode } from "@/atoms/onboarding";

/**
 * Sparkles icon for Guided Setup
 */
function SparklesIcon() {
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
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}

/**
 * Sliders icon for Manual Setup
 */
function SlidersIcon() {
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
            className="text-foreground-secondary"
        >
            <line x1="4" x2="4" y1="21" y2="14" />
            <line x1="4" x2="4" y1="10" y2="3" />
            <line x1="12" x2="12" y1="21" y2="12" />
            <line x1="12" x2="12" y1="8" y2="3" />
            <line x1="20" x2="20" y1="21" y2="16" />
            <line x1="20" x2="20" y1="12" y2="3" />
            <line x1="2" x2="6" y1="14" y2="14" />
            <line x1="10" x2="14" y1="8" y2="8" />
            <line x1="18" x2="22" y1="16" y2="16" />
        </svg>
    );
}

interface ModeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    onClick: () => void;
}

function ModeCard({ icon, title, description, badge, onClick }: ModeCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full p-4 rounded-2xl bg-surface border border-border text-left transition-all hover:border-gold/50 active:scale-[0.98]"
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-3">
                        {description}
                    </p>
                    {badge && (
                        <div className="flex items-center gap-1 text-sm text-gold uppercase tracking-wide font-medium">
                            {badge}
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
}

export function Mode() {
    const navigate = useNavigate();
    const setWizardData = useSetAtom(wizardDataAtom);

    const handleSelect = (mode: SetupMode) => {
        setWizardData((prev) => ({ ...prev, setupMode: mode }));

        if (mode === "guided") {
            navigate("/setup/measurements");
        } else {
            navigate("/setup/manual");
        }
    };

    return (
        <WizardLayout
            currentStep={1}
            totalSteps={4}
            showProgress={false}
        >
            {/* Content */}
            <div className="flex-1 pt-8">
                {/* Step indicator */}
                <p className="text-sm text-foreground-secondary uppercase tracking-wider mb-4">
                    Step 1 of 4
                </p>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    How do you want to start?
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-8">
                    Choose how you'd like to configure your nutritional goals. You can always adjust these settings later.
                </p>

                {/* Mode cards */}
                <div className="space-y-4">
                    <ModeCard
                        icon={<SparklesIcon />}
                        title="Guided Setup"
                        description="We'll ask a few questions about your body type and goals to build a personalized plan for you."
                        badge="Recommended"
                        onClick={() => handleSelect("guided")}
                    />

                    <ModeCard
                        icon={<SlidersIcon />}
                        title="Manual Setup"
                        description="Already know your targets? Enter your calorie and macro goals directly without the quiz."
                        badge="Configure manually"
                        onClick={() => handleSelect("manual")}
                    />
                </div>
            </div>

            {/* Footer hint */}
            <div className="py-6 text-center">
                <p className="text-sm text-foreground-secondary">
                    Not sure? Start with{" "}
                    <button
                        type="button"
                        onClick={() => handleSelect("guided")}
                        className="text-gold font-medium"
                    >
                        Guided Setup
                    </button>
                    .
                </p>
            </div>
        </WizardLayout>
    );
}

export default Mode;

