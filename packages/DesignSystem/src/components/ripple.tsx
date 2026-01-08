import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface RippleItem {
  x: number
  y: number
  id: number
}

interface RippleProps {
  /** Color of the ripple effect. Can be any CSS color value */
  color?: string
  /** Duration of the ripple animation in milliseconds */
  duration?: number
  /** Whether the ripple container should have rounded corners (for circular buttons) */
  rounded?: boolean | "full" | "lg" | "md" | "sm" | "none"
  /** Additional class name for the ripple container */
  className?: string
  /** The element to wrap with ripple effect */
  children: React.ReactElement
  /** Disable the ripple effect */
  disabled?: boolean
}

const roundedClasses = {
  true: "rounded-full",
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded-sm",
  none: "",
  false: "",
}

/**
 * Ripple wrapper component that adds a Material-style ripple effect to any clickable element.
 * 
 * @example
 * ```tsx
 * <Ripple color="rgba(255,255,255,0.3)">
 *   <button className="px-4 py-2 bg-blue-500">Click me</button>
 * </Ripple>
 * ```
 */
export function Ripple({
  color = "rgba(255, 255, 255, 0.4)",
  duration = 600,
  rounded = "full",
  className,
  children,
  disabled = false,
}: Readonly<RippleProps>) {
  const [ripples, setRipples] = React.useState<RippleItem[]>([])
  const containerRef = React.useRef<HTMLDivElement>(null)

  const addRipple = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
      if (disabled) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()

      // Get coordinates from mouse or touch event
      let clientX: number
      let clientY: number

      if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else if ("clientX" in event) {
        clientX = event.clientX
        clientY = event.clientY
      } else {
        return
      }

      const x = clientX - rect.left
      const y = clientY - rect.top
      const id = Date.now() + Math.random()

      setRipples((prev) => [...prev, { x, y, id }])

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
      }, duration)
    },
    [disabled, duration]
  )

  // Clone the child element and attach event handlers
  const child = React.Children.only(children) as React.ReactElement<{
    onMouseDown?: (e: React.MouseEvent) => void
    onTouchStart?: (e: React.TouchEvent) => void
  }>
  const childProps = child.props
  const enhancedChild = React.cloneElement(child, {
    onMouseDown: (e: React.MouseEvent) => {
      addRipple(e)
      childProps.onMouseDown?.(e)
    },
    onTouchStart: (e: React.TouchEvent) => {
      addRipple(e)
      childProps.onTouchStart?.(e)
    },
  })

  const roundedClass = typeof rounded === "boolean"
    ? roundedClasses[rounded.toString() as "true" | "false"]
    : roundedClasses[rounded]

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      {enhancedChild}
      <span
        className={cn(
          "absolute inset-0 overflow-hidden pointer-events-none",
          roundedClass
        )}
        aria-hidden="true"
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: color,
              }}
              initial={{
                width: 0,
                height: 0,
                x: "-50%",
                y: "-50%",
                opacity: 0.6
              }}
              animate={{
                width: 400,
                height: 400,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: duration / 1000,
                ease: "easeOut"
              }}
            />
          ))}
        </AnimatePresence>
      </span>
    </div>
  )
}

// Also export the hook version for more complex use cases
export { useRipple } from "./rippleEffect"

