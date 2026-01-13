import * as React from "react"
import {
  TextField,
  Input as AriaInput,
  Label,
  Text,
  type TextFieldProps as AriaTextFieldProps
} from "react-aria-components"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const inputVariants = cva(
  "w-full text-foreground placeholder:text-foreground-secondary rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  {
    variants: {
      variant: {
        default: "bg-surface border-border",
        outline: "bg-transparent border-foreground/30 hover:border-foreground/50",
      },
      size: {
        xs: "h-6 text-xs px-2",
        sm: "h-8 text-sm px-3",
        default: "h-9 px-4",
        lg: "h-10 px-5",
        xl: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Size-aware adornment positioning
const adornmentConfig = {
  xs: { start: "pl-6", end: "pr-6", startPos: "left-1.5", endPos: "right-1" },
  sm: { start: "pl-8", end: "pr-8", startPos: "left-2.5", endPos: "right-1.5" },
  default: { start: "pl-10", end: "pr-10", startPos: "left-3", endPos: "right-2" },
  lg: { start: "pl-11", end: "pr-11", startPos: "left-3.5", endPos: "right-2" },
  xl: { start: "pl-12", end: "pr-14", startPos: "left-4", endPos: "right-2" },
}

interface InputProps extends Omit<AriaTextFieldProps, "className">,
  VariantProps<typeof inputVariants> {
  /** Content to render on the left side of the input (e.g., icon) */
  startAdornment?: React.ReactNode
  /** Content to render on the right side of the input (e.g., button, icon) */
  endAdornment?: React.ReactNode
  /** Label text for the input */
  label?: string
  /** Description text shown below the input */
  description?: string
  /** Error message to display */
  errorMessage?: string
  /** Additional class name for the input element */
  className?: string
  /** Additional class name for the label element */
  labelClassName?: string
  /** Placeholder text */
  placeholder?: string
  /** Input type */
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    labelClassName,
    startAdornment,
    endAdornment,
    label,
    description,
    errorMessage,
    placeholder,
    type = "text",
    isInvalid,
    variant,
    size,
    ...props
  }, ref) => {
    const hasError = isInvalid || !!errorMessage
    const sizeKey = size ?? "default"
    const adornment = adornmentConfig[sizeKey]

    return (
      <TextField
        {...props}
        isInvalid={hasError}
        className="w-full"
      >
        {label && (
          <Label className={cn(
            "block text-sm font-medium text-foreground mb-1.5",
            labelClassName
          )}>
            {label}
          </Label>
        )}

        <div className="relative w-full">
          {startAdornment && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 pointer-events-none",
              adornment.startPos
            )}>
              {startAdornment}
            </div>
          )}

          <AriaInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={cn(
              inputVariants({ variant, size }),
              startAdornment && adornment.start,
              endAdornment && adornment.end,
              hasError && "border-destructive focus:ring-destructive",
              className,
            )}
          />

          {endAdornment && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2",
              adornment.endPos
            )}>
              {endAdornment}
            </div>
          )}
        </div>

        {description && !hasError && (
          <Text slot="description" className="mt-1.5 text-sm text-foreground-secondary">
            {description}
          </Text>
        )}

        {errorMessage && (
          <Text slot="errorMessage" className="mt-1.5 text-sm text-destructive">
            {errorMessage}
          </Text>
        )}
      </TextField>
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
