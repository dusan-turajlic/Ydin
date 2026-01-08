import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Format number for display: integers stay whole, decimals get 1 decimal place */
export function formatDisplayValue(value: number): string | number {
  return value % 1 === 0 ? value : value.toFixed(1)
}

/** Calculate percentage (0-100) from value/target, clamped */
export function calculatePercentage(value: number, target: number): number {
  if (target <= 0) return 0
  return Math.round((value / target) * 100)
}
