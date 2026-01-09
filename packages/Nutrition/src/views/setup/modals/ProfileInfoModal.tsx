import { Button } from "@ydin/design-system";

/**
 * Flask/beaker icon
 */
function BeakerIcon() {
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
            <path d="M4.5 3h15" />
            <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
            <path d="M6 14h12" />
        </svg>
    );
}

interface ProfileInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileInfoModal({ isOpen, onClose }: ProfileInfoModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-surface rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300"
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

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <BeakerIcon />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground text-center mb-2">
                    Calculation Profiles
                </h2>

                {/* Subtitle */}
                <p className="text-foreground-secondary text-center mb-6">
                    Understanding how we estimate your basal metabolic rate (BMR).
                </p>

                {/* Section title */}
                <p className="text-xs text-foreground-secondary uppercase tracking-wider mb-3">
                    Selectable Profiles
                </p>

                {/* Profile cards */}
                <div className="space-y-4 mb-6">
                    {/* XY Profile */}
                    <div className="p-4 rounded-xl bg-muted">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl font-bold text-foreground-secondary">
                                XY
                            </span>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                    Male Profile
                                </h3>
                                <p className="text-sm text-foreground-secondary">
                                    Optimized for XY chromosomal physiology. This calculation accounts for typically higher lean muscle mass density and different hormonal metabolic factors.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* XX Profile */}
                    <div className="p-4 rounded-xl bg-muted">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl font-bold text-foreground-secondary">
                                XX
                            </span>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                    Female Profile
                                </h3>
                                <p className="text-sm text-foreground-secondary">
                                    Optimized for XX chromosomal physiology. This adjusts for essential body fat requirements and metabolic variations linked to hormonal cycles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info note */}
                <p className="text-xs text-foreground-secondary text-center mb-6">
                    These profiles are starting points. You can always adjust your targets manually.
                </p>

                {/* Action */}
                <Button
                    className="w-full"
                    size="xl"
                    onPress={onClose}
                >
                    Got It
                </Button>
            </div>
        </div>
    );
}

export default ProfileInfoModal;

