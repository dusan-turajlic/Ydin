import type * as React from "react"
import { cn } from "@/lib/utils"

interface TabButtonProps {
  /** Icon to display before the text */
  icon?: React.ReactNode
  /** Tab label text */
  children?: React.ReactNode
  /** Additional class name */
  className?: string
  /** 
   * @deprecated Active state is now controlled by TabGroup. This prop is kept for backward compatibility.
   */
  active?: boolean
}

/**
 * Content component for tab triggers.
 * Used inside TabGroup to render the tab label with optional icon.
 * 
 * @example
 * ```tsx
 * <TabGroup
 *   tabs={[
 *     { tab: <TabButton icon={<Home />}>Home</TabButton>, content: <HomePanel /> },
 *     { tab: <TabButton icon={<Settings />}>Settings</TabButton>, content: <SettingsPanel /> },
 *   ]}
 * />
 * ```
 */
export function TabButton({ 
  children, 
  icon, 
  className,
}: Readonly<TabButtonProps>) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </span>
  )
}
