import * as React from "react"
import { motion } from "framer-motion"

interface Tab {
  tab: React.ReactNode
  content: React.ReactNode
}

interface TabGroupProps {
  tabs: Tab[]
  defaultTab?: number
  onTabChange?: (index: number) => void
}

export function TabGroup({ tabs, defaultTab = 0, onTabChange }: Readonly<TabGroupProps>) {
  const [activeTab, setActiveTab] = React.useState(defaultTab)
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })
  const tabRefs = React.useRef<(HTMLDivElement | null)[]>([])

  React.useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab]
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      })
    }
  }, [activeTab])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    onTabChange?.(index)
  }

  const setTabRef = (index: number) => (el: HTMLDivElement | null) => {
    tabRefs.current[index] = el
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-4" role="tablist">
          {tabs.map((tab, index) => (
            <div
              key={`tab-${index}`}
              ref={setTabRef(index)}
              role="tab"
              tabIndex={0}
              aria-selected={activeTab === index}
              onClick={() => handleTabChange(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTabChange(index)
                }
              }}
              className="cursor-pointer"
            >
              {React.isValidElement(tab.tab)
                ? React.cloneElement(tab.tab as React.ReactElement<{ active?: boolean }>, {
                  active: activeTab === index,
                })
                : tab.tab}
            </div>
          ))}
        </div>
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
      <div className="rounded-xl bg-surface" role="tabpanel">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}
