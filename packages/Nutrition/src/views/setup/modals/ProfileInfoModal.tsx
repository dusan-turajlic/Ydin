import { Button, FixedModalSheet, FixedModalSheetContent } from "@ydin/design-system";
import { Beaker } from "@ydin/design-system/icons";

interface ProfileInfoModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export function ProfileInfoModal({ isOpen, onClose }: ProfileInfoModalProps) {
    return (
        <FixedModalSheet
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            snapPoints={[0.85]}
            dismissible
        >
            <FixedModalSheetContent className="text-center">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Beaker className="text-accent size-8" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground">
                    Calculation Profiles
                </h2>

                {/* Subtitle */}
                <p className="text-foreground-secondary text-left">
                    These profiles help us choose the correct calculation method for your metabolism.
                    The formulas are based on biological differences that affect how bodies use energy at rest.
                    <br />
                    They don’t define identity they simply help us run the math correctly.
                    <br />
                    Choose the profile that best matches your biological starting point.
                </p>

                {/* Section title */}
                <p className="text-xs text-foreground-secondary uppercase tracking-wider text-left">
                    Selectable Profiles
                </p>

                {/* Profile cards */}
                <div className="space-y-4">
                    {/* XY Profile */}
                    <div className="p-4 rounded-xl bg-muted text-left">
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
                    <div className="p-4 rounded-xl bg-muted text-left">
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
                <p className="text-xs text-foreground-secondary">
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
            </FixedModalSheetContent>
        </FixedModalSheet>
    );
}

export default ProfileInfoModal;
