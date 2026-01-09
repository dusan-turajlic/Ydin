import { useNavigate } from "react-router-dom";
import { Button } from "@ydin/design-system";

/**
 * Fire/flame icon for branding
 */
function FlameIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
        >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
    );
}

export function Welcome() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/setup/mode");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Safe area padding */}
            <div className="pt-[env(safe-area-inset-top)]" />

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6">
                {/* Logo/Icon */}
                <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center mb-8">
                    <FlameIcon />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground text-center">
                    Welcome to
                </h1>
                <h2 className="text-3xl font-bold text-gold text-center mb-4">
                    MacroTrace
                </h2>

                {/* Subtitle */}
                <p className="text-foreground-secondary text-center max-w-xs">
                    The premium minimalist tracker for your nutritional journey. Clarity, focused.
                </p>
            </main>

            {/* Footer */}
            <footer className="px-4 pb-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleStart}
                >
                    Start Setup
                </Button>

                <button
                    type="button"
                    className="w-full mt-4 text-sm text-foreground-secondary uppercase tracking-wider text-center"
                >
                    Already have an account?
                </button>
            </footer>
        </div>
    );
}

export default Welcome;

