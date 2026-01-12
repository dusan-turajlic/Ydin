import { useNavigate } from "react-router-dom";
import { Sparkles, SlidersHorizontal } from "@ydin/design-system/icons";
import { Button, Card } from "@ydin/design-system";
import { WizardLayout, ArrowRightIcon } from "./WizardLayout";

export function Mode() {
    const navigate = useNavigate();

    const handleSelect = (path: string) => {

        navigate(path);
    };

    return (
        <WizardLayout
            currentStep={1}
            totalSteps={4}
            showProgress={false}
        >
            {/* Content */}
            <div className="flex-1 pt-8">
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
                    <Card
                        icon={<Sparkles className="text-gold" size={24} />}
                        title="Guided Setup"
                        onClick={() => navigate("/setup/measurements")}
                    >
                        <p className="text-sm text-foreground-secondary mt-1 mb-3">
                            We'll ask a few questions about your body type and goals to build a personalized plan for you.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gold uppercase tracking-wide font-medium">
                            Recommended
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </Card>

                    <Card
                        icon={<SlidersHorizontal className="text-foreground-secondary" size={24} />}
                        title="Manual Setup"
                        onClick={() => navigate("/setup/manual")}
                    >
                        <p className="text-sm text-foreground-secondary mt-1 mb-3">
                            Already know your targets? Enter your calorie and macro goals directly without the quiz.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gold uppercase tracking-wide font-medium">
                            Configure manually
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Footer hint */}
            <div className="py-6 text-center">
                <p className="text-sm text-foreground-secondary">
                    Not sure? Start with{" "}
                    <Button
                        disableRipple
                        variant="link"
                        size="link"
                        onClick={() => navigate("/setup/measurements")}
                    >
                        Guided Setup
                    </Button>
                    .
                </p>
            </div>
        </WizardLayout >
    );
}

export default Mode;

