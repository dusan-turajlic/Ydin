import * as React from "react"
import { Drawer } from "vaul"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Context to share state between ModalSheet and its children
interface ModalSheetContextValue {
  isOpen: boolean
  onExpand?: () => void
}

const ModalSheetContext = React.createContext<ModalSheetContextValue | null>(null)

function useModalSheetContext() {
  const context = React.useContext(ModalSheetContext)
  if (!context) {
    throw new Error("ModalSheet components must be used within a ModalSheet")
  }
  return context
}

// Main ModalSheet component
interface ModalSheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

function ModalSheet({
  children,
  open = false,
  onOpenChange,
  modal = true,
}: Readonly<React.PropsWithChildren<ModalSheetProps>>) {
  // Extracts the valid children and their visibility props
  const { peek, peekVisibleWhenCollapsed, content, bottomPeek, bottomPeekVisibleWhenCollapsed } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)
    
    const peek = childrenArray.find((child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType
        if (childType.displayName === ModalSheetPeek.displayName) {
          return true
        }
      }
      return false
    }) as React.ReactElement<ModalSheetPeekProps> | undefined

    const content = childrenArray.find((child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType
        if (childType.displayName === ModalSheetContent.displayName) {
          return true
        }
      }
      return false
    })

    const bottomPeek = childrenArray.find((child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        const childType = child.type as React.ComponentType
        if (childType.displayName === ModalSheetBottomPeek.displayName) {
          return true
        }
      }
      return false
    }) as React.ReactElement<ModalSheetBottomPeekProps> | undefined

    // Extract visibleWhenCollapsed props (default to true for backward compat)
    const peekVisibleWhenCollapsed = peek?.props?.visibleWhenCollapsed ?? true
    const bottomPeekVisibleWhenCollapsed = bottomPeek?.props?.visibleWhenCollapsed ?? true

    return { peek, peekVisibleWhenCollapsed, content, bottomPeek, bottomPeekVisibleWhenCollapsed }
  }, [children])

  // Drawer stays open if any peek wants to be visible when collapsed OR if open=true
  const hasPersistentPeek = 
    (peek && peekVisibleWhenCollapsed) || 
    (bottomPeek && bottomPeekVisibleWhenCollapsed)
  const drawerOpen = hasPersistentPeek || open

  // Key to force re-mount when we need to reset to peek state
  const [resetKey, setResetKey] = React.useState(0)

  // Handle open change
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen)

    // When closing with persistent peek, immediately queue a reset
    if (!newOpen && hasPersistentPeek) {
      // Use queueMicrotask to reset after current JS execution
      queueMicrotask(() => {
        setResetKey((k) => k + 1)
      })
    }
  }

  const showOverlay = modal && open

  // Function to expand the drawer (for drag-up on handle)
  const handleExpand = React.useCallback(() => {
    if (!open) {
      onOpenChange?.(true)
    }
  }, [open, onOpenChange])

  const contextValue = React.useMemo(
    () => ({ isOpen: open, onExpand: handleExpand }),
    [open, handleExpand]
  )

  return (
    <ModalSheetContext.Provider value={contextValue}>
      <Drawer.Root
        key={hasPersistentPeek ? resetKey : undefined}
        open={drawerOpen}
        onOpenChange={handleOpenChange}
        modal={modal}
        dismissible={true}
      >
        <Drawer.Portal>
          <AnimatePresence>
            {showOverlay && (
              <Drawer.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                />
              </Drawer.Overlay>
            )}
          </AnimatePresence>
          <Drawer.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-3xl border-t border-border bg-surface outline-none",
              !modal && "pointer-events-auto shadow-elevated"
            )}
          >
            <ModalSheetHandle />
            <motion.div
              layout
              className="px-4 pb-6 overflow-hidden"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {peek}
              {content}
              {bottomPeek}
            </motion.div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </ModalSheetContext.Provider>
  )
}

// Handle bar with drag-up gesture support
function ModalSheetHandle() {
  const { isOpen, onExpand } = useModalSheetContext()

  // Handle drag end - if dragged up significantly, expand
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    // If dragged up (negative y) by more than 20px and not already open
    if (info.offset.y < -20 && !isOpen && onExpand) {
      onExpand()
    }
  }

  return (
    <motion.div
      className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
    >
      <div className="h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/40" />
    </motion.div>
  )
}

// Peek content - always visible when sheet is rendered (top position)
interface ModalSheetPeekProps {
  className?: string
  /** Whether this peek is visible when the sheet is collapsed. Default: true */
  visibleWhenCollapsed?: boolean
}

function ModalSheetPeek({
  children,
  className,
}: Readonly<React.PropsWithChildren<ModalSheetPeekProps>>) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}

// Add displayName for reliable child detection
ModalSheetPeek.displayName = "ModalSheetPeek"

// Bottom Peek content - always visible when sheet is rendered (bottom position)
interface ModalSheetBottomPeekProps {
  className?: string
  /** Whether this peek is visible when the sheet is collapsed. Default: true */
  visibleWhenCollapsed?: boolean
}

function ModalSheetBottomPeek({
  children,
  className,
}: Readonly<React.PropsWithChildren<ModalSheetBottomPeekProps>>) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}

// Add displayName for reliable child detection
ModalSheetBottomPeek.displayName = "ModalSheetBottomPeek"

// Expandable content - controlled by open prop
interface ModalSheetContentProps {
  className?: string
}

function ModalSheetContent({
  children,
  className,
}: Readonly<React.PropsWithChildren<ModalSheetContentProps>>) {
  const { isOpen } = useModalSheetContext()

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn("pt-4 space-y-4", className)}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

ModalSheetContent.displayName = "ModalSheetContent"

export { ModalSheet, ModalSheetPeek, ModalSheetBottomPeek, ModalSheetContent, ModalSheetHandle }
export type { ModalSheetProps, ModalSheetPeekProps, ModalSheetBottomPeekProps, ModalSheetContentProps }
