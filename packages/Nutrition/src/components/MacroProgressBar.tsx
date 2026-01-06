import { useAtomValue } from "jotai";
import { ProgressIndicator } from "@ydin/design-system";
import { targetsAtom } from "@/atoms/targets";
import { dailyTotalsAtom } from "@/atoms/day";
import { NUTRIENT_COLORS } from "@/constants/colors";

interface MacroConfig {
    key: "calories" | "protein" | "fat" | "carbs";
    icon: string;
    color: string;
}

const macroConfigs: MacroConfig[] = [
    { key: "calories", icon: "🔥", color: NUTRIENT_COLORS.calories },
    { key: "protein", icon: "P", color: NUTRIENT_COLORS.protein },
    { key: "fat", icon: "F", color: NUTRIENT_COLORS.fat },
    { key: "carbs", icon: "C", color: NUTRIENT_COLORS.carbs },
];

export default function MacroProgressBar() {
    const targets = useAtomValue(targetsAtom);
    const totals = useAtomValue(dailyTotalsAtom);

    return (
        <div className="flex flex-col gap-2 px-4 pb-2 my-4 sticky top-10 z-10 bg-primary-foreground">
            <div className="grid grid-cols-4 gap-2">
                {macroConfigs.map(({ key, icon, color }) => {
                    const value = Math.round(totals[key]);
                    const max = targets[key];

                    return (
                        <div key={key} className="flex flex-col gap-1">
                            <div className="flex items-center">
                                <span className="text-[0.625rem] text-foreground-secondary">{icon}</span>
                                <span className="text-[0.625rem] text-foreground-secondary ml-1">
                                    {value} / {max}
                                </span>
                            </div>
                            <ProgressIndicator
                                value={value}
                                max={max}
                                size="sm"
                                color={color}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
