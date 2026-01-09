import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout, InfoIcon, ArrowRightIcon } from "./WizardLayout";
import { wizardDataAtom, type BiologicalProfile } from "@/atoms/onboarding";
import { ProfileInfoModal } from "./modals/ProfileInfoModal";

/**
 * Profile selection card
 */
interface ProfileCardProps {
    profile: BiologicalProfile;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

function ProfileCard({
    profile,
    title,
    description,
    isSelected,
    onSelect,
}: ProfileCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`w-full p-5 rounded-2xl text-left transition-all ${
                isSelected
                    ? "bg-surface border-2 border-gold"
                    : "bg-surface border border-border hover:border-gold/50"
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Profile symbol */}
                    <span className="text-4xl font-bold text-foreground-secondary mb-2 block">
                        {profile}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gold mb-2">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-foreground-secondary">
                        {description}
                    </p>
                </div>

                {/* Radio indicator */}
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                            ? "border-gold bg-gold"
                            : "border-foreground-secondary"
                    }`}
                >
                    {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-background" />
                    )}
                </div>
            </div>
        </button>
    );
}

export function Profile() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const handleSelect = (profile: BiologicalProfile) => {
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
                    <ProfileCard
                        profile="XY"
                        title="Male Profile"
                        description="Calculations optimized for male hormonal baselines, muscle mass density, and metabolic rate factors."
                        isSelected={wizardData.biologicalProfile === "XY"}
                        onSelect={() => handleSelect("XY")}
                    />

                    <ProfileCard
                        profile="XX"
                        title="Female Profile"
                        description="Calculations optimized for female hormonal cycles, body composition distribution, and BMR standards."
                        isSelected={wizardData.biologicalProfile === "XX"}
                        onSelect={() => handleSelect("XX")}
                    />
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

