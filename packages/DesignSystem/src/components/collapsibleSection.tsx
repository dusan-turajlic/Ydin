import * as React from "react"
import { 
  Disclosure, 
  DisclosurePanel, 
  Button as AriaButton,
  type DisclosureProps as AriaDisclosureProps
} from "react-aria-components"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps extends Omit<AriaDisclosureProps, "children" | "className"> {
  /** Section title */
  title: string
  /** Whether the section is open by default */
  defaultOpen?: boolean
  /** Optional color class for the title */
  titleColor?: string
  /** Additional CSS classes for the container */
  className?: string
  /** Content to render inside the collapsible section */
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  titleColor,
  className,
  children,
  ...props
}: Readonly<CollapsibleSectionProps>) {
  return (
    <Disclosure 
      {...props}
      defaultExpanded={defaultOpen}
      className={cn("border-b border-border", className)}
    >
      {({ isExpanded }) => (
        <>
          <AriaButton
            slot="trigger"
            className="flex items-center justify-between w-full py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded cursor-pointer"
          >
            <span className={cn("text-base font-semibold text-foreground", titleColor)}>
              {title}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-foreground-secondary" />
            </motion.div>
          </AriaButton>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <DisclosurePanel>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-3">
                    {children}
                  </div>
                </motion.div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  )
}
