import { 
  ProgressBar, 
  Label,
  type ProgressBarProps as AriaProgressBarProps 
} from "react-aria-components"
import { cn } from "@/lib/utils"

type ProgressSize = "xl" | "lg" | "md" | "sm"

interface ProgressIndicatorProps extends Omit<AriaProgressBarProps, "value" | "className" | "children"> {
  /** Current value */
  value: number
  /** Maximum value (minValue is always 0) */
  max: number
  /** Size variant */
  size?: ProgressSize
  /** Custom background color class (e.g., "bg-red-500"), defaults to "bg-gold" */
  color?: string
  /** Additional CSS classes */
  className?: string
  /** Optional label for accessibility (visually hidden by default) */
  label?: string
}

const sizeStyles = {
  xl: "px-8 py-4 min-w-[180px] text-base",
  lg: "px-6 py-2.5 min-w-[140px] text-sm",
  md: "px-4 py-2 min-w-[100px]",
  sm: "h-2 min-w-[80px]",
}

export function ProgressIndicator({
  value,
  max,
  size = "lg",
  color = "bg-gold",
  className,
  label,
  ...props
}: Readonly<ProgressIndicatorProps>) {
  // Calculate progress percentage (0-100)
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const displayText = `${value} / ${max}`
  const showText = size === "xl" || size === "lg"

  // Small variant - simple thin bar
  if (size === "sm") {
    return (
      <ProgressBar
        {...props}
        value={value}
        minValue={0}
        maxValue={max}
        aria-label={label ?? `Progress: ${value} of ${max}`}
        className={cn(
          "relative rounded-full overflow-hidden bg-surface border border-border",
          sizeStyles.sm,
          className,
        )}
      >
        {({ percentage: pct }) => (
          <>
            {label && <Label className="sr-only">{label}</Label>}
            <div
              className={cn("absolute inset-y-0 left-0 transition-all duration-300 ease-out rounded-full", color)}
              style={{ width: `${pct}%` }}
            />
          </>
        )}
      </ProgressBar>
    )
  }

  // Medium variant - pill without text
  if (size === "md") {
    return (
      <ProgressBar
        {...props}
        value={value}
        minValue={0}
        maxValue={max}
        aria-label={label ?? `Progress: ${value} of ${max}`}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden",
          "bg-surface border border-border",
          sizeStyles.md,
          className,
        )}
      >
        {({ percentage: pct }) => (
          <>
            {label && <Label className="sr-only">{label}</Label>}
            <div
              className={cn("absolute inset-y-0 left-0 transition-all duration-300 ease-out rounded-full", color)}
              style={{ width: `${pct}%` }}
            />
          </>
        )}
      </ProgressBar>
    )
  }

  // XL and LG variants - pill with text
  return (
    <ProgressBar
      {...props}
      value={value}
      minValue={0}
      maxValue={max}
      aria-label={label ?? `Progress: ${value} of ${max}`}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden",
        "bg-surface border border-border",
        sizeStyles[size],
        className,
      )}
    >
      {({ percentage: pct }) => (
        <>
          {label && <Label className="sr-only">{label}</Label>}
          <div
            className={cn("absolute inset-y-0 left-0 transition-all duration-300 ease-out rounded-full", color)}
            style={{ width: `${pct}%` }}
          />

          {showText && (
            <>
              {/* Text on unfilled portion */}
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${percentage}%)` }}
              >
                <span className={cn("font-medium text-foreground-secondary whitespace-nowrap", size === "xl" ? "text-base" : "text-sm")}>
                  {displayText}
                </span>
              </div>

              {/* Text on filled portion */}
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
              >
                <span className={cn("font-medium text-background whitespace-nowrap", size === "xl" ? "text-base" : "text-sm")}>
                  {displayText}
                </span>
              </div>

              {/* Invisible text for proper sizing */}
              <span className={cn("font-medium opacity-0 whitespace-nowrap", size === "xl" ? "text-base" : "text-sm")}>
                {displayText}
              </span>
            </>
          )}
        </>
      )}
    </ProgressBar>
  )
}
