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
  /** Unique identifier for the tab. If not provided, uses the index as string */
  id?: string
  /** The tab trigger content - can use TabButton or any React node */
  tab: React.ReactNode
  /** The tab panel content */
  content: React.ReactNode
  /** Whether the tab is disabled */
  isDisabled?: boolean
}

interface TabGroupProps extends Omit<AriaTabsProps, "children" | "onSelectionChange" | "defaultSelectedKey" | "selectedKey"> {
  /** Array of tab items */
  tabs: TabItem[]
  /** ID or index of the initially active tab */
  defaultTab?: string | number
  /** Callback when tab changes (receives the tab id) */
  onTabChange?: (id: string) => void
  /** Additional class name for the container */
  className?: string
}

/** Get the effective ID for a tab item */
function getTabId(tabItem: TabItem, index: number): string {
  return tabItem.id ?? String(index)
}

export function TabGroup({
  tabs,
  defaultTab = 0,
  onTabChange,
  className,
  ...props
}: Readonly<TabGroupProps>) {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })
  const tabRefs = React.useRef<Map<string, HTMLElement>>(new Map())

  // Resolve the default tab to an ID
  const defaultTabId = typeof defaultTab === "number"
    ? getTabId(tabs[defaultTab], defaultTab)
    : defaultTab

  const [selectedId, setSelectedId] = React.useState(defaultTabId)

  // Update indicator position when selection changes
  React.useEffect(() => {
    const selectedTab = tabRefs.current.get(selectedId)
    if (selectedTab) {
      setIndicatorStyle({
        left: selectedTab.offsetLeft,
        width: selectedTab.offsetWidth,
      })
    }
  }, [selectedId])

  // Also update on mount and resize
  React.useEffect(() => {
    const updateIndicator = () => {
      const selectedTab = tabRefs.current.get(selectedId)
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
  }, [selectedId, tabs])

  const handleSelectionChange = (key: Key) => {
    const id = String(key)
    setSelectedId(id)
    onTabChange?.(id)
  }

  return (
    <Tabs
      {...props}
      selectedKey={selectedId}
      onSelectionChange={handleSelectionChange}
      className={cn("space-y-4", className)}
    >
      <div className="relative">
        <TabList className="flex gap-4">
          {tabs.map((tabItem, index) => {
            const tabId = getTabId(tabItem, index)
            return (
              <Tab
                key={tabId}
                id={tabId}
                ref={(el) => {
                  if (el) tabRefs.current.set(tabId, el)
                  else tabRefs.current.delete(tabId)
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
            )
          })}
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

      {tabs.map((tabItem, index) => {
        const tabId = getTabId(tabItem, index)
        return (
          <TabPanel
            key={tabId}
            id={tabId}
            className="rounded-xl bg-surface outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {tabItem.content}
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
