import { cn } from "@/lib/utils"

interface MacroBadgeProps {
    /** The numeric value to display */
    value: number
    /** Label text (e.g., "Cal", "Fat", "Carbs", "Prot") */
    label: string
    /** Color class for the indicator dot (e.g., "bg-emerald-500") */
    color?: string
    /** Unit to display after value (optional, e.g., "g") */
    unit?: string
    /** Additional CSS classes */
    className?: string
}

export function MacroBadge({
    value,
    label,
    color = "bg-gold",
    unit,
    className,
}: Readonly<MacroBadgeProps>) {
    const displayValue = value % 1 === 0 ? value : value.toFixed(1)

    return (
        <div className={cn("flex flex-col items-center gap-0.5", className)}>
            {/* Color indicator dot */}
            <div className={cn("w-2 h-2 rounded-full", color)} />
            {/* Value */}
            <span className="text-lg font-bold text-foreground">
                {displayValue}{unit && <span className="text-sm font-normal">{unit}</span>}
            </span>
            {/* Label */}
            <span className="text-xs text-foreground-secondary uppercase tracking-wide">
                {label}
            </span>
        </div>
    )
}

