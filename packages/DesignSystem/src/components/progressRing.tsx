import type * as React from "react"
import { cn, clamp } from "@/lib/utils"

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Progress value from 0 to 100 */
    value: number
    /** Diameter of the ring in pixels */
    size?: number
    /** Width of the stroke in pixels */
    strokeWidth?: number
    /** Color class for the progress stroke (Tailwind class like "stroke-gold") */
    color?: string
    /** Optional color class for the background track */
    trackColor?: string
    /** Whether to show the track behind the progress */
    showTrack?: boolean
    /** Additional class name */
    className?: string
    /** Content to render inside the ring */
    children?: React.ReactNode
}

/**
 * A circular progress indicator using SVG.
 * 
 * @example
 * ```tsx
 * <ProgressRing value={75} size={48} color="stroke-gold" />
 * 
 * // With content inside
 * <ProgressRing value={50} size={64}>
 *   <span className="text-sm">50%</span>
 * </ProgressRing>
 * ```
 */
export function ProgressRing({
    value,
    size = 48,
    strokeWidth = 2,
    color = "stroke-gold",
    trackColor = "stroke-muted",
    showTrack = false,
    className,
    children,
    ...props
}: Readonly<ProgressRingProps>) {
    // Clamp value between 0 and 100
    const clampedValue = clamp(value, 0, 100)

    // Calculate SVG properties
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference
    const center = size / 2

    return (
        <div
            className={cn("relative inline-flex items-center justify-center", className)}
            style={{ width: size, height: size }}
            {...props}
        >
            <svg
                className="absolute inset-0 -rotate-90"
                width={size}
                height={size}
                aria-hidden="true"
            >
                {/* Background track */}
                {showTrack && (
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        strokeWidth={strokeWidth}
                        className={cn("opacity-20", trackColor)}
                    />
                )}

                {/* Progress circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-300", color)}
                />
            </svg>

            {/* Center content */}
            {children && (
                <div className="relative z-10 flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    )
}

