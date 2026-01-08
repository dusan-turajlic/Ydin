import * as React from "react"
import { 
  TextField, 
  Input as AriaInput, 
  Label, 
  Text,
  type TextFieldProps as AriaTextFieldProps 
} from "react-aria-components"
import { cn } from "@/lib/utils"

interface InputProps extends Omit<AriaTextFieldProps, "className"> {
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
  /** Placeholder text */
  placeholder?: string
  /** Input type */
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    startAdornment, 
    endAdornment, 
    label,
    description,
    errorMessage,
    placeholder,
    type = "text",
    isInvalid,
    ...props 
  }, ref) => {
    const hasError = isInvalid || !!errorMessage

    return (
      <TextField 
        {...props} 
        isInvalid={hasError}
        className="w-full"
      >
        {label && (
          <Label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </Label>
        )}
        
        <div className="relative w-full">
          {startAdornment && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {startAdornment}
            </div>
          )}
          
          <AriaInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={cn(
              "w-full h-12 bg-surface text-foreground placeholder:text-foreground-secondary rounded-full border border-border",
              "focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent",
              "transition-all",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              startAdornment ? "pl-12" : "pl-4",
              endAdornment ? "pr-14" : "pr-4",
              hasError && "border-destructive focus:ring-destructive",
              className,
            )}
          />
          
          {endAdornment && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
