import { Button } from "@ydin/design-system";

/**
 * Heart icon for Apple Health
 */
function HeartIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-pink-500"
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

/**
 * Watch icon for fitness trackers
 */
function WatchIcon() {
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
            className="text-blue-400"
        >
            <circle cx="12" cy="12" r="6" />
            <polyline points="12 10 12 12 13 13" />
            <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
            <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
        </svg>
    );
}

interface StepItem {
    text: string;
    bold?: string[];
}

interface StepCountHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StepCountHelpModal({ isOpen, onClose }: StepCountHelpModalProps) {
    if (!isOpen) return null;

    const appleHealthSteps: StepItem[] = [
        { text: "Open the Health app on your iPhone.", bold: ["Health app"] },
        { text: "Tap on the Browse tab at the bottom right.", bold: ["Browse"] },
        { text: "Navigate to Activity > Steps.", bold: ["Activity", "Steps"] },
        { text: "Check the Average for the last 7 days at the top of the chart.", bold: ["Average"] },
    ];

    const fitnessTrackerSteps: StepItem[] = [
        { text: "Open your device's Companion App.", bold: ["Companion App"] },
        { text: "Go to the Dashboard or Activity tab.", bold: ["Dashboard", "Activity"] },
        { text: "Find the Steps card to view your weekly average.", bold: ["Steps"] },
    ];

    const renderStep = (step: StepItem, index: number, isFirst: boolean) => {
        let textContent = step.text;
        if (step.bold) {
            step.bold.forEach((boldText) => {
                textContent = textContent.replace(
                    boldText,
                    `<strong class="text-foreground font-medium">${boldText}</strong>`
                );
            });
        }

        return (
            <div key={index} className="flex items-start gap-3">
                <div
                    className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                        isFirst ? "bg-gold" : "bg-foreground-secondary"
                    }`}
                />
                <p
                    className="text-sm text-foreground-secondary"
                    dangerouslySetInnerHTML={{ __html: textContent }}
                />
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-surface rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-foreground-secondary hover:text-foreground"
                    aria-label="Close"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Find your step count
                </h2>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-6">
                    To calculate your daily energy expenditure accurately, we need your average weekly step count. Here is how to find it.
                </p>

                {/* Apple Health section */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <HeartIcon />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Apple Health
                            </h3>
                            <p className="text-xs text-gold uppercase tracking-wider">
                                Recommended
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted space-y-3">
                        {appleHealthSteps.map((step, i) =>
                            renderStep(step, i, i === 0)
                        )}
                    </div>
                </div>

                {/* Fitness Trackers section */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <WatchIcon />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Fitness Trackers
                            </h3>
                            <p className="text-xs text-foreground-secondary uppercase tracking-wider">
                                Fitbit • Garmin • Oura
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted space-y-3">
                        {fitnessTrackerSteps.map((step, i) =>
                            renderStep(step, i, false)
                        )}
                    </div>
                </div>

                {/* Action */}
                <Button
                    className="w-full"
                    size="xl"
                    onPress={onClose}
                >
                    I found it
                </Button>
            </div>
        </div>
    );
}

export default StepCountHelpModal;

