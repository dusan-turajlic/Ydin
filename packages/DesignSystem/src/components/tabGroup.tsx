import * as React from "react"
import { 
  Tabs, 
  TabList, 
  Tab, 
  TabPanel,
  type TabsProps as AriaTabsProps,
  type Key
} from "react-aria-components"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabItem {
  /** Unique key for the tab (optional, uses index if not provided) */
  id?: string
  /** The tab trigger content - can use TabButton or any React node */
  tab: React.ReactNode
  /** The tab panel content */
  content: React.ReactNode
  /** Whether the tab is disabled */
  isDisabled?: boolean
}

interface TabGroupProps extends Omit<AriaTabsProps, "children" | "onSelectionChange"> {
  /** Array of tab items */
  tabs: TabItem[]
  /** Index of the initially active tab */
  defaultTab?: number
  /** Callback when tab changes (receives the new tab index) */
  onTabChange?: (index: number) => void
  /** Additional class name for the container */
  className?: string
}

export function TabGroup({ 
  tabs, 
  defaultTab = 0, 
  onTabChange,
  className,
  ...props 
}: Readonly<TabGroupProps>) {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })
  const tabRefs = React.useRef<Map<number, HTMLElement>>(new Map())
  const [selectedIndex, setSelectedIndex] = React.useState(defaultTab)

  // Update indicator position when selection changes
  React.useEffect(() => {
    const selectedTab = tabRefs.current.get(selectedIndex)
    if (selectedTab) {
      setIndicatorStyle({
        left: selectedTab.offsetLeft,
        width: selectedTab.offsetWidth,
      })
    }
  }, [selectedIndex])

  // Also update on mount and resize
  React.useEffect(() => {
    const updateIndicator = () => {
      const selectedTab = tabRefs.current.get(selectedIndex)
      if (selectedTab) {
        setIndicatorStyle({
          left: selectedTab.offsetLeft,
          width: selectedTab.offsetWidth,
        })
      }
    }
    
    // Small delay to ensure refs are populated
    const timer = setTimeout(updateIndicator, 0)
    window.addEventListener("resize", updateIndicator)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateIndicator)
    }
  }, [selectedIndex, tabs])

  const handleSelectionChange = (key: Key) => {
    const index = typeof key === "number" ? key : parseInt(String(key), 10)
    setSelectedIndex(index)
    onTabChange?.(index)
  }

  return (
    <Tabs
      {...props}
      selectedKey={selectedIndex}
      onSelectionChange={handleSelectionChange}
      className={cn("space-y-4", className)}
    >
      <div className="relative">
        <TabList className="flex gap-4">
          {tabs.map((tabItem, index) => (
            <Tab
              key={tabItem.id ?? index}
              id={index}
              ref={(el) => {
                if (el) tabRefs.current.set(index, el)
                else tabRefs.current.delete(index)
              }}
              isDisabled={tabItem.isDisabled}
              className={({ isSelected, isDisabled, isFocusVisible }) =>
                cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors outline-none cursor-pointer",
                  isSelected ? "text-white" : "text-foreground-secondary hover:text-white",
                  isDisabled && "opacity-50 cursor-not-allowed",
                  isFocusVisible && "ring-2 ring-gold ring-offset-2 ring-offset-background"
                )
              }
            >
              {tabItem.tab}
            </Tab>
          ))}
        </TabList>
        
        {/* Animated indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-gold"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </div>

      {tabs.map((tabItem, index) => (
        <TabPanel
          key={tabItem.id ?? index}
          id={index}
          className="rounded-xl bg-surface outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {tabItem.content}
        </TabPanel>
      ))}
    </Tabs>
  )
}
