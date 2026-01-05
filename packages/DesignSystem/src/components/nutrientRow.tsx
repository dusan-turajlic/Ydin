import { cn } from "@/lib/utils"
import { ProgressIndicator } from "./progressIndicator"

interface NutrientRowProps {
    /** Nutrient name (e.g., "Fiber", "Vitamin C") */
    label: string
    /** Current value */
    value: number
    /** Target/maximum value (optional - if not provided, shows "No Target") */
    target?: number
    /** Unit of measurement (e.g., "g", "mg", "μg") */
    unit?: string
    /** Color class for the progress bar (e.g., "bg-emerald-500") */
    color?: string
    /** Additional CSS classes */
    className?: string
}

export function NutrientRow({
    label,
    value,
    target,
    unit = "g",
    color = "bg-gold",
    className,
}: Readonly<NutrientRowProps>) {
    const hasTarget = target !== undefined && target > 0
    const percentage = hasTarget ? Math.round((value / target) * 100) : 0
    const displayValue = value % 1 === 0 ? value : value.toFixed(1)
    const displayTarget = target !== undefined ? (target % 1 === 0 ? target : target.toFixed(1)) : null

    return (
        <div className={cn("flex flex-col gap-1 py-2", className)}>
            <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground-secondary">
                        {displayValue}{hasTarget && ` / ${displayTarget}`} {unit}
                    </span>
                    {hasTarget ? (
                        <span className="text-sm text-foreground-secondary w-10 text-right">
                            {percentage}%
                        </span>
                    ) : (
                        <span className="text-xs text-foreground-secondary/60 w-16 text-right">
                            No Target
                        </span>
                    )}
                </div>
            </div>
            {hasTarget && (
                <ProgressIndicator
                    value={value}
                    max={target}
                    size="sm"
                    color={color}
                />
            )}
        </div>
    )
}

