import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@ydin/design-system";
import { ChevronLeftIcon } from "@ydin/design-system/icons";

interface WizardLayoutProps {
    children: ReactNode;
    /** Current step (1-indexed) */
    currentStep?: number;
    /** Total steps */
    totalSteps?: number;
    /** Show back button */
    showBack?: boolean;
    /** Custom back handler */
    onBack?: () => void;
    /** Right header action (e.g., info button) */
    headerAction?: ReactNode;
    /** Show progress bar */
    showProgress?: boolean;
}

/**
 * Shared wizard layout with navigation and progress bar
 */
export function WizardLayout({
    children,
    currentStep,
    totalSteps = 4,
    showBack = true,
    onBack,
    headerAction,
    showProgress = true,
}: WizardLayoutProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-20 bg-background border-b border-border">
                {/* Safe area padding for notch */}
                <div className="pt-[env(safe-area-inset-top)]" />
                {/* Back button */}
                <div className="w-10">
                    {showBack && (
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onPress={handleBack}
                            aria-label="Go back"
                        >
                            <ChevronLeftIcon />
                        </Button>
                    )}
                </div>

                {/* Progress bar */}
                <div className="flex-1 flex justify-center">
                    {showProgress && currentStep !== undefined && (
                        <ProgressBar
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                        />
                    )}
                </div>

                {/* Right action */}
                <div className="w-10 flex justify-end">
                    {headerAction}
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col px-4 pb-[env(safe-area-inset-bottom)]">
                {children}
            </main>
        </div>
    );
}

/**
 * Segmented progress bar
 */
function ProgressBar({
    currentStep,
    totalSteps,
}: {
    currentStep: number;
    totalSteps: number;
}) {
    return (
        <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => {
                const stepIndex = i + 1;
                const isActive = stepIndex <= currentStep;

                return (
                    <div
                        key={i}
                        className={`h-1 w-12 rounded-full transition-colors ${isActive ? "bg-gold" : "bg-muted"
                            }`}
                    />
                );
            })}
        </div>
    );
}

/**
 * Info icon for modals
 */
export function InfoIcon({ className = "" }: { className?: string }) {
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
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}

/**
 * Chevron right icon for cards
 */
export function ChevronRightIcon({ className = "" }: { className?: string }) {
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
            className={className}
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

/**
 * Arrow right icon for buttons
 */
export function ArrowRightIcon({ className = "" }: { className?: string }) {
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
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

export default WizardLayout;

