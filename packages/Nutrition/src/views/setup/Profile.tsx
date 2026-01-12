import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button, Card } from "@ydin/design-system";
import { WizardLayout, InfoIcon, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom, type BiologicalProfile } from "@/atoms/onboarding";
import { ProfileInfoModal } from "./modals/ProfileInfoModal";

function RadioIndicator({ isSelected }: { readonly isSelected: boolean }) {
    return (
        <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected
                ? "border-gold bg-gold"
                : "border-foreground-secondary"
                }`}
        >
            {isSelected && (
                <div className="w-2 h-2 rounded-full bg-background" />
            )}
        </div>
    );
}

export function Profile() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const handleSelect = (profile: BiologicalProfile) => {
        console.log("handleSelect", profile);
        setWizardData((prev) => ({ ...prev, biologicalProfile: profile }));
    };

    const handleNext = () => {
        if (wizardData.biologicalProfile) {
            navigate("/setup/activity");
        }
    };

    return (
        <WizardLayout
            currentStep={2}
            totalSteps={4}
            headerAction={
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onPress={() => setShowInfoModal(true)}
                    aria-label="Profile information"
                    className="text-gold"
                >
                    <InfoIcon />
                </Button>
            }
        >
            {/* Content */}
            <div className="flex-1 pt-8 text-center">
                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Select Calculation Profile
                </h1>

                {/* Subtitle */}
                <p className="text-foreground-secondary mb-8 max-w-sm mx-auto">
                    Choose the biological profile that best matches your physiology to calibrate your metabolic baseline.
                </p>

                {/* Profile cards */}
                <div className="space-y-4 text-left">
                    <Card
                        icon={
                            <span className="text-2xl font-bold text-foreground-secondary">
                                XY
                            </span>
                        }
                        title="Male Profile"
                        onClick={() => handleSelect("XY")}
                        selected={wizardData.biologicalProfile === "XY"}
                        action={
                            <RadioIndicator
                                isSelected={wizardData.biologicalProfile === "XY"}
                            />
                        }
                    >
                        <p className="text-sm text-foreground-secondary mt-1">
                            Uses the calculation commonly applied to male physiology.
                            Most people assigned male at birth should choose this.
                        </p>
                    </Card>

                    <Card
                        icon={
                            <span className="text-2xl font-bold text-foreground-secondary">
                                XX
                            </span>
                        }
                        title="Female Profile"
                        onClick={() => handleSelect("XX")}
                        selected={wizardData.biologicalProfile === "XX"}
                        action={
                            <RadioIndicator
                                isSelected={wizardData.biologicalProfile === "XX"}
                            />
                        }
                    >
                        <p className="text-sm text-foreground-secondary mt-1">
                            Uses the calculation commonly applied to female physiology.
                            Most people assigned female at birth should choose this.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <div className="py-6">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleNext}
                    isDisabled={!wizardData.biologicalProfile}
                >
                    Next
                    <ArrowRightIcon />
                </Button>
            </div>

            {/* Info Modal */}
            <ProfileInfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
            />
        </WizardLayout>
    );
}

export default Profile;
