import { useNavigate } from "react-router-dom";
import { Button } from "@ydin/design-system";
import YdinNutritionLogo from "@/assets/ydin-nutrition.svg?react";

export function Welcome() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/setup/country");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Safe area padding */}
            <div className="pt-[env(safe-area-inset-top)]" />

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6">
                {/* Logo/Icon */}
                <div className="flex items-center justify-center mb-4">
                    <YdinNutritionLogo className="h-24 w-24" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground text-center">
                    Welcome to
                </h1>
                <h2 className="text-3xl font-bold text-gold text-center mb-4">
                    Ydin Nutrition
                </h2>

                {/* Subtitle */}
                <p className="text-foreground-secondary text-center max-w-xs">
                    A clean, stress-free tracker for your nutritional journey.
                </p>
            </main>

            {/* Footer */}
            <footer className="px-4 pb-16 flex items-center justify-center">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleStart}
                >
                    Start Setup
                </Button>
                <div className="h-[env(safe-area-inset-bottom)]" />
            </footer>
        </div>
    );
}

export default Welcome;

