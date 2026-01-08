import { describe, it, expect } from 'vitest'
import { clamp, formatDisplayValue, calculatePercentage } from '../utils'
import {
  boundaryTestCases,
  formatDisplayTestCases,
  percentageTestCases,
} from '../../test/helpers'

describe('clamp', () => {
  describe('boundary conditions for 0-100 range', () => {
    const testCases = boundaryTestCases(0, 100)

    testCases.forEach(({ input, expected, desc }) => {
      it(`${desc}: clamp(${input}, 0, 100) = ${expected}`, () => {
        expect(clamp(input, 0, 100)).toBe(expected)
      })
    })
  })

  describe('custom ranges', () => {
    it('works with negative range', () => {
      expect(clamp(-5, -10, 0)).toBe(-5)
      expect(clamp(-15, -10, 0)).toBe(-10)
      expect(clamp(5, -10, 0)).toBe(0)
    })

    it('works with decimal range', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5)
      expect(clamp(1.5, 0, 1)).toBe(1)
      expect(clamp(-0.5, 0, 1)).toBe(0)
    })

    it('handles equal min and max', () => {
      expect(clamp(10, 5, 5)).toBe(5)
      expect(clamp(0, 5, 5)).toBe(5)
    })
  })
})

describe('formatDisplayValue', () => {
  const testCases = formatDisplayTestCases()

  testCases.forEach(({ input, expected, desc }) => {
    it(`${desc}: formatDisplayValue(${input}) = ${expected}`, () => {
      expect(formatDisplayValue(input)).toBe(expected)
    })
  })

  describe('edge cases', () => {
    it('handles very small decimals', () => {
      expect(formatDisplayValue(0.01)).toBe('0.0')
    })

    it('handles values near integer boundaries', () => {
      expect(formatDisplayValue(0.999)).toBe('1.0')
      expect(formatDisplayValue(1.001)).toBe('1.0')
    })
  })
})

describe('calculatePercentage', () => {
  const testCases = percentageTestCases()

  testCases.forEach(({ value, target, expected, desc }) => {
    it(`${desc}: calculatePercentage(${value}, ${target}) = ${expected}`, () => {
      expect(calculatePercentage(value, target)).toBe(expected)
    })
  })

  describe('rounding behavior', () => {
    it('rounds 0.5 up', () => {
      // 1/200 = 0.5% -> should round to 1 or 0 depending on implementation
      // Our impl uses Math.round, so 0.5 rounds to 1
      expect(calculatePercentage(1, 200)).toBe(1)
    })

    it('rounds down when below 0.5', () => {
      // 1/300 = 0.33% -> rounds to 0
      expect(calculatePercentage(1, 300)).toBe(0)
    })
  })
})

