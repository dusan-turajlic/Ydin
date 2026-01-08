import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components"
import { cn } from "@/lib/utils"
import { Ripple } from "./ripple"
import { ProgressRing } from "./progressRing"

interface DayButtonProps extends Omit<AriaButtonProps, "className" | "children"> {
  /** Abbreviated day name (e.g., "Mon", "Tue") */
  day: string
  /** Day of the month (e.g., 1, 15, 31) */
  date: number
  /** Whether this day is currently selected/active */
  active?: boolean
  /** Progress percentage (0-100) shown as a ring around the button */
  progress?: number
  /** Additional CSS classes */
  className?: string
}

export function DayButton({ 
  day, 
  date, 
  active = false, 
  progress = 0, 
  className, 
  ...props 
}: Readonly<DayButtonProps>) {
  const cappedProgress = Math.min(Math.max(progress, 0), 100)
  const rippleColor = active ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.3)"

  // Size for the progress ring (slightly larger than button)
  const ringSize = 48
  const strokeWidth = 2

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Progress ring overlay */}
      {cappedProgress > 0 && (
        <ProgressRing
          value={cappedProgress}
          size={ringSize}
          strokeWidth={strokeWidth}
          color="stroke-gold"
          className="absolute inset-0 pointer-events-none z-10"
        />
      )}

      <Ripple color={rippleColor}>
        <AriaButton
          {...props}
          className={cn(
            "flex flex-col items-center justify-center gap-0 rounded-full w-12 h-12 transition-all outline-none",
            "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "relative overflow-hidden z-0 cursor-pointer",
            active 
              ? "bg-gold text-background" 
              : "bg-surface text-muted-foreground hover:bg-muted hover:text-white",
            className,
          )}
        >
          <span className="text-[8px] font-medium uppercase leading-tight">{day}</span>
          <span className="text-sm font-bold leading-tight">{date}</span>
        </AriaButton>
      </Ripple>
    </div>
  )
}
