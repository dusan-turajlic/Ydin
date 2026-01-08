import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components"
import { cva, type VariantProps } from "class-variance-authority"
import { Ripple } from "@/components/ripple"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gold text-background hover:bg-gold-hover active:bg-gold-active shadow-sm",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border border-border bg-transparent shadow-xs hover:bg-surface hover:text-foreground",
        secondary: "bg-muted text-foreground hover:bg-surface",
        ghost: "hover:bg-surface hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "bg-surface text-foreground hover:bg-muted rounded-full",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 text-base has-[>svg]:px-6",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonProps = Omit<AriaButtonProps, "className"> &
  VariantProps<typeof buttonVariants> & {
    className?: string
    /** Disable ripple effect */
    disableRipple?: boolean
  }

export function Button({
  className,
  variant,
  size,
  disableRipple = false,
  children,
  ...props
}: ButtonProps) {
  const rippleColor = variant === "default" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.3)"

  const button = (
    <AriaButton
      className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
      {...props}
    >
      {children}
    </AriaButton>
  )

  if (disableRipple) {
    return button
  }

  return (
    <Ripple color={rippleColor} disabled={props.isDisabled}>
      {button}
    </Ripple>
  )
}
