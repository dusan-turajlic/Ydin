import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * Content to render on the left side of the input (e.g., icon)
     */
    startAdornment?: React.ReactNode
    /**
     * Content to render on the right side of the input (e.g., button, icon)
     */
    endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, startAdornment, endAdornment, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {startAdornment && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        {startAdornment}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full h-12 bg-surface text-foreground placeholder:text-foreground-secondary rounded-full border border-border",
                        "focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent",
                        "transition-all",
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        startAdornment ? "pl-12" : "pl-4",
                        endAdornment ? "pr-14" : "pr-4",
                        className,
                    )}
                    {...props}
                />
                {endAdornment && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {endAdornment}
                    </div>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }

