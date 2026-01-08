import * as React from "react"
import { createPortal } from "react-dom"
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion"
import { cn } from "@/lib/utils"

// Context to share state between FixedModalSheet and its children
interface FixedModalSheetContextValue {
  isOpen: boolean
  isExpanded: boolean
  currentSnapPoint: number
  snapTo: (index: number) => void
  expand: () => void
  collapse: () => void
}

const FixedModalSheetContext = React.createContext<FixedModalSheetContextValue | null>(null)

function useFixedModalSheetContext() {
  const context = React.useContext(FixedModalSheetContext)
  if (!context) {
    throw new Error("FixedModalSheet components must be used within a FixedModalSheet")
  }
  return context
}

/** Utility to convert snap point to pixels */
export function snapPointToPixels(snapPoint: number | string, windowHeight: number): number {
  if (typeof snapPoint === "number") {
    if (snapPoint > 0 && snapPoint <= 1) {
      return windowHeight * snapPoint
    }
    return snapPoint
  }
  if (snapPoint.endsWith("vh")) {
    return (parseFloat(snapPoint) / 100) * windowHeight
  }
  if (snapPoint.endsWith("px")) {
    return parseFloat(snapPoint)
  }
  if (snapPoint.endsWith("%")) {
    return (parseFloat(snapPoint) / 100) * windowHeight
  }
  return parseFloat(snapPoint)
}

// Main FixedModalSheet component
interface FixedModalSheetProps {
  /** Controls if content is expanded (true) or collapsed to peek (false) */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** 
   * Snap points for the sheet when expanded. Can be:
   * - Numbers 0-1 for percentages (0.5 = 50% of screen)
   * - Numbers > 1 for pixels (400 = 400px)
   * - Strings like "80vh", "500px", "50%"
   * Default: [0.5, 0.9]
   */
  snapPoints?: (number | string)[]
  /** Initial snap point index when expanded. Default: 0 */
  initialSnap?: number
  /** Show backdrop overlay when expanded. Default: true */
  modal?: boolean
  /** Allow dismissing by dragging down. Default: true */
  dismissible?: boolean
  /** Velocity threshold for snap (px/s). Default: 500 */
  velocityThreshold?: number
}

function FixedModalSheet({
  children,
  open = false,
  onOpenChange,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  modal = true,
  dismissible = true,
  velocityThreshold = 500,
}: Readonly<React.PropsWithChildren<FixedModalSheetProps>>) {
  const [windowHeight, setWindowHeight] = React.useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  )
  const [currentSnapIndex, setCurrentSnapIndex] = React.useState(initialSnap)
  const peekRef = React.useRef<HTMLDivElement>(null)
  const bottomPeekRef = React.useRef<HTMLDivElement>(null)
  const [peekHeight, setPeekHeight] = React.useState(0)

  // Convert snap points to pixel values
  const snapPointsPx = React.useMemo(
    () => snapPoints.map((sp) => snapPointToPixels(sp, windowHeight)),
    [snapPoints, windowHeight]
  )

  // Motion value for sheet height
  const sheetHeight = useMotionValue(0)

  // Extract children by type
  const { peek, peekVisibleWhenCollapsed, content, bottomPeek, bottomPeekVisibleWhenCollapsed } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    const peek = childrenArray.find((child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType
        return childType.displayName === FixedModalSheetPeek.displayName
      }
      return false
    }) as React.ReactElement<FixedModalSheetPeekProps> | undefined

    const content = childrenArray.find((child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType
        return childType.displayName === FixedModalSheetContent.displayName
      }
      return false
    })

    const bottomPeek = childrenArray.find((child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType
        return childType.displayName === FixedModalSheetBottomPeek.displayName
      }
      return false
    }) as React.ReactElement<FixedModalSheetBottomPeekProps> | undefined

    const peekVisibleWhenCollapsed = peek?.props?.visibleWhenCollapsed ?? true
    const bottomPeekVisibleWhenCollapsed = bottomPeek?.props?.visibleWhenCollapsed ?? true

    return { peek, peekVisibleWhenCollapsed, content, bottomPeek, bottomPeekVisibleWhenCollapsed }
  }, [children])

  // Determine if sheet should be visible at all
  const hasPersistentPeek =
    (peek && peekVisibleWhenCollapsed) ||
    (bottomPeek && bottomPeekVisibleWhenCollapsed)
  
  const isSheetVisible = hasPersistentPeek || open

  // Measure peek height
  React.useEffect(() => {
    const measurePeeks = () => {
      let totalPeekHeight = 56 // Handle height
      if (peekRef.current) {
        totalPeekHeight += peekRef.current.offsetHeight
      }
      if (bottomPeekRef.current) {
        totalPeekHeight += bottomPeekRef.current.offsetHeight
      }
      setPeekHeight(totalPeekHeight)
    }

    measurePeeks()
    window.addEventListener("resize", measurePeeks)
    return () => window.removeEventListener("resize", measurePeeks)
  }, [peek, bottomPeek])

  // Update window height on resize
  React.useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animate to correct height when open state changes
  React.useEffect(() => {
    if (!isSheetVisible) {
      animate(sheetHeight, 0, { type: "spring", damping: 30, stiffness: 300 })
      return
    }

    if (open) {
      // Expanded to snap point
      const targetHeight = snapPointsPx[currentSnapIndex] ?? snapPointsPx[0]
      animate(sheetHeight, targetHeight, { type: "spring", damping: 30, stiffness: 300 })
    } else {
      // Collapsed to peek height
      animate(sheetHeight, peekHeight, { type: "spring", damping: 30, stiffness: 300 })
    }
  }, [open, isSheetVisible, currentSnapIndex, snapPointsPx, peekHeight, sheetHeight])

  // Snap to a specific index
  const snapTo = React.useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, snapPoints.length - 1))
      setCurrentSnapIndex(clampedIndex)
      animate(sheetHeight, snapPointsPx[clampedIndex], {
        type: "spring",
        damping: 30,
        stiffness: 300,
      })
    },
    [snapPoints.length, snapPointsPx, sheetHeight]
  )

  const expand = React.useCallback(() => {
    onOpenChange?.(true)
  }, [onOpenChange])

  const collapse = React.useCallback(() => {
    onOpenChange?.(false)
  }, [onOpenChange])

  // Handle drag end
  const handleDragEnd = React.useCallback(
    (_: never, info: { velocity: { y: number }; offset: { y: number } }) => {
      const currentHeight = sheetHeight.get()
      const velocity = info.velocity.y

      // If dragging down fast
      if (velocity > velocityThreshold) {
        if (open) {
          // If expanded and at lowest snap, collapse to peek
          if (currentSnapIndex === 0) {
            if (hasPersistentPeek) {
              collapse()
            } else if (dismissible) {
              onOpenChange?.(false)
            }
          } else {
            snapTo(currentSnapIndex - 1)
          }
        } else if (dismissible && !hasPersistentPeek) {
          // If collapsed and dismissible, close completely
          onOpenChange?.(false)
        }
        return
      }

      // If dragging up fast
      if (velocity < -velocityThreshold) {
        if (!open) {
          // If collapsed, expand
          expand()
        } else if (currentSnapIndex < snapPoints.length - 1) {
          snapTo(currentSnapIndex + 1)
        }
        return
      }

      // Find nearest state based on position
      if (!open) {
        // Currently collapsed - check if should expand
        if (currentHeight > peekHeight * 1.5) {
          expand()
        } else {
          animate(sheetHeight, peekHeight, { type: "spring", damping: 30, stiffness: 300 })
        }
      } else {
        // Currently expanded - find nearest snap or collapse
        if (currentHeight < peekHeight * 1.2 && hasPersistentPeek) {
          collapse()
        } else {
          // Find nearest snap point
          let nearestIndex = 0
          let minDistance = Math.abs(currentHeight - snapPointsPx[0])
          
          for (let i = 1; i < snapPointsPx.length; i++) {
            const distance = Math.abs(currentHeight - snapPointsPx[i])
            if (distance < minDistance) {
              minDistance = distance
              nearestIndex = i
            }
          }
          snapTo(nearestIndex)
        }
      }
    },
    [sheetHeight, velocityThreshold, open, currentSnapIndex, hasPersistentPeek, dismissible, 
     onOpenChange, collapse, expand, snapTo, snapPoints.length, snapPointsPx, peekHeight]
  )

  const contextValue = React.useMemo(
    () => ({
      isOpen: open,
      isExpanded: open,
      currentSnapPoint: currentSnapIndex,
      snapTo,
      expand,
      collapse,
    }),
    [open, currentSnapIndex, snapTo, expand, collapse]
  )

  const showOverlay = modal && open

  // Portal content
  const sheetContent = (
    <FixedModalSheetContext.Provider value={contextValue}>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 pointer-events-auto"
              onClick={() => dismissible && onOpenChange?.(false)}
            />
          )}
        </AnimatePresence>

        {/* Sheet */}
        <AnimatePresence>
          {isSheetVisible && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn(
                "absolute inset-x-0 bottom-0 flex flex-col",
                "rounded-t-3xl border-t border-border bg-surface shadow-elevated",
                "pointer-events-auto outline-none"
              )}
              style={{
                height: sheetHeight,
                maxHeight: `calc(100vh - env(safe-area-inset-top) - 20px)`,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing shrink-0">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
              </div>

              {/* Top Peek - always visible when sheet is visible */}
              {peek && (
                <div ref={peekRef} className="shrink-0 px-4">
                  {peek}
                </div>
              )}

              {/* Content - only visible when expanded, scrollable */}
              <AnimatePresence mode="wait">
                {open && content && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 touch-pan-y"
                  >
                    {content}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Peek - always visible when sheet is visible */}
              {bottomPeek && (
                <div ref={bottomPeekRef} className="shrink-0 px-4 pb-6">
                  {bottomPeek}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FixedModalSheetContext.Provider>
  )

  if (typeof window === "undefined") return null
  return createPortal(sheetContent, document.body)
}

// Peek component - visible when collapsed (top position)
interface FixedModalSheetPeekProps {
  className?: string
  /** Whether this peek is visible when collapsed. Default: true */
  visibleWhenCollapsed?: boolean
}

function FixedModalSheetPeek({
  children,
  className,
}: Readonly<React.PropsWithChildren<FixedModalSheetPeekProps>>) {
  return <div className={cn("py-2", className)}>{children}</div>
}

FixedModalSheetPeek.displayName = "FixedModalSheetPeek"

// Bottom Peek component - visible when collapsed (bottom position)
interface FixedModalSheetBottomPeekProps {
  className?: string
  /** Whether this peek is visible when collapsed. Default: true */
  visibleWhenCollapsed?: boolean
}

function FixedModalSheetBottomPeek({
  children,
  className,
}: Readonly<React.PropsWithChildren<FixedModalSheetBottomPeekProps>>) {
  return <div className={cn("pt-2", className)}>{children}</div>
}

FixedModalSheetBottomPeek.displayName = "FixedModalSheetBottomPeek"

// Content component - only visible when expanded, scrollable
interface FixedModalSheetContentProps {
  className?: string
}

function FixedModalSheetContent({
  children,
  className,
}: Readonly<React.PropsWithChildren<FixedModalSheetContentProps>>) {
  return <div className={cn("space-y-4 pt-4", className)}>{children}</div>
}

FixedModalSheetContent.displayName = "FixedModalSheetContent"

export {
  FixedModalSheet,
  FixedModalSheetPeek,
  FixedModalSheetBottomPeek,
  FixedModalSheetContent,
  useFixedModalSheetContext,
}

export type {
  FixedModalSheetProps,
  FixedModalSheetPeekProps,
  FixedModalSheetBottomPeekProps,
  FixedModalSheetContentProps,
}
