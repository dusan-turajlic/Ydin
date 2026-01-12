import { useId } from "react"
import { RadioGroup, Radio } from "react-aria-components"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const segmentedControlVariants = cva(
  "flex bg-muted rounded-full p-0.5",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const segmentedControlItemVariants = cva(
  "relative rounded-full cursor-pointer outline-none text-foreground-secondary data-[selected]:text-foreground transition-colors font-medium z-10",
  {
    variants: {
      size: {
        sm: "px-2 py-1",
        default: "px-3 py-1.5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

interface SegmentedControlProps<T extends string> extends VariantProps<typeof segmentedControlVariants> {
  /** The options to display */
  readonly options: readonly { value: T; label: string }[]
  /** The currently selected value */
  readonly value?: T
  /** Callback when the selection changes */
  readonly onChange?: (value: T) => void
  /** Additional class name */
  readonly className?: string
  /** Accessible label for the control */
  readonly "aria-label"?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  // Generate unique layoutId for this instance to prevent conflicts
  const layoutId = useId()

  return (
    <RadioGroup
      value={value}
      onChange={(v) => onChange?.(v as T)}
      orientation="horizontal"
      aria-label={ariaLabel}
      className={cn(segmentedControlVariants({ size }), className)}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          className={segmentedControlItemVariants({ size })}
        >
          {value === option.value && (
            <motion.div
              layoutId={`segmented-indicator-${layoutId}`}
              className="absolute inset-0 bg-surface rounded-full -z-10 shadow-sm"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 35,
              }}
            />
          )}
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  )
}
