import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/ui/input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  action?: React.ReactNode
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, action, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        startAdornment={
          <Search className="h-5 w-5 text-foreground-secondary" />
        }
        endAdornment={action}
        onInput={(e) => onSearch?.(e.currentTarget.value)}
        {...props}
      />
    )
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput }
