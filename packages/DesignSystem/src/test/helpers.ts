/**
 * Shared test helpers for Design System unit tests.
 * Provides reusable utilities for common testing patterns.
 */

interface BoundaryTestCase {
  input: number
  expected: number
  desc: string
}

/** Generate test cases for boundary/clamping conditions */
export function boundaryTestCases(min: number, max: number): BoundaryTestCase[] {
  return [
    { input: min - 1, expected: min, desc: 'below min clamps to min' },
    { input: min, expected: min, desc: 'at min stays at min' },
    { input: (min + max) / 2, expected: (min + max) / 2, desc: 'middle value unchanged' },
    { input: max, expected: max, desc: 'at max stays at max' },
    { input: max + 1, expected: max, desc: 'above max clamps to max' },
  ]
}

interface SnapPointTestCase {
  input: number | string
  windowHeight: number
  expected: number
  desc: string
}

/** Generate test cases for snap point conversions */
export function snapPointTestCases(windowHeight: number = 1000): SnapPointTestCase[] {
  return [
    { input: 0.5, windowHeight, expected: 500, desc: 'decimal 0.5 = 50% of window' },
    { input: 0.9, windowHeight, expected: 900, desc: 'decimal 0.9 = 90% of window' },
    { input: 1, windowHeight, expected: 1000, desc: 'decimal 1 = 100% of window' },
    { input: 400, windowHeight, expected: 400, desc: 'pixel number returns as-is' },
    { input: '50vh', windowHeight, expected: 500, desc: 'vh string parsed correctly' },
    { input: '300px', windowHeight, expected: 300, desc: 'px string parsed correctly' },
    { input: '75%', windowHeight, expected: 750, desc: 'percent string parsed correctly' },
    { input: '0', windowHeight, expected: 0, desc: 'numeric string parsed as number' },
  ]
}

interface FormatDisplayTestCase {
  input: number
  expected: string | number
  desc: string
}

/** Generate test cases for display value formatting */
export function formatDisplayTestCases(): FormatDisplayTestCase[] {
  return [
    { input: 10, expected: 10, desc: 'integer returns as number' },
    { input: 0, expected: 0, desc: 'zero returns as number' },
    { input: 10.5, expected: '10.5', desc: 'single decimal returns string' },
    { input: 10.12345, expected: '10.1', desc: 'long decimal rounds to 1 place' },
    { input: -5, expected: -5, desc: 'negative integer returns as number' },
    { input: -5.678, expected: '-5.7', desc: 'negative decimal rounds correctly' },
  ]
}

interface PercentageTestCase {
  value: number
  target: number
  expected: number
  desc: string
}

/** Generate test cases for percentage calculations */
export function percentageTestCases(): PercentageTestCase[] {
  return [
    { value: 50, target: 100, expected: 50, desc: 'normal 50%' },
    { value: 100, target: 100, expected: 100, desc: 'full 100%' },
    { value: 150, target: 100, expected: 150, desc: 'over 100% allowed' },
    { value: 0, target: 100, expected: 0, desc: 'zero value = 0%' },
    { value: 50, target: 0, expected: 0, desc: 'zero target = 0%' },
    { value: 50, target: -10, expected: 0, desc: 'negative target = 0%' },
    { value: 33, target: 100, expected: 33, desc: 'rounds to nearest integer' },
    { value: 1, target: 3, expected: 33, desc: 'rounds 33.33... to 33' },
  ]
}

