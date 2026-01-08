import * as React from "react"
import {
  SearchField,
  Input as AriaInput,
  Button as AriaButton,
  type SearchFieldProps as AriaSearchFieldProps
} from "react-aria-components"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps extends Omit<AriaSearchFieldProps, "className" | "children"> {
  /** Callback when search value changes */
  onSearch?: (value: string) => void
  /** Action element to render on the right side (e.g., barcode scanner button) */
  action?: React.ReactNode
  /** Placeholder text */
  placeholder?: string
  /** Additional class name */
  className?: string
  /** Show clear button when there's text */
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, action, placeholder = "Search...", className, showClearButton = true, onChange, ...props }, ref) => {
    const handleChange = (value: string) => {
      onChange?.(value)
      onSearch?.(value)
    }

    return (
      <SearchField
        {...props}
        onChange={handleChange}
        className={cn("group relative w-full", className)}
      >
        {({ state }) => (
          <>
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Search className="h-5 w-5 text-foreground-secondary" />
            </div>

            <AriaInput
              ref={ref}
              placeholder={placeholder}
              className={cn(
                "w-full h-12 bg-surface text-foreground placeholder:text-foreground-secondary rounded-full border border-border",
                "focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent",
                "transition-all pl-12",
                action || showClearButton ? "pr-14" : "pr-4",
              )}
            />

            {/* Right side: clear button or custom action */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {showClearButton && state.value && (
                <AriaButton
                  className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </AriaButton>
              )}
              {action}
            </div>
          </>
        )}
      </SearchField>
    )
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput }
