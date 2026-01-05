import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
    /** Section title */
    title: string
    /** Whether the section is open by default */
    defaultOpen?: boolean
    /** Optional color accent for the title */
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
}: Readonly<CollapsibleSectionProps>) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className={cn("border-b border-border", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-3 text-left"
            >
                <span className={cn("text-base font-semibold text-foreground", titleColor)}>
                    {title}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-5 w-5 text-foreground-secondary" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
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
                )}
            </AnimatePresence>
        </div>
    )
}

