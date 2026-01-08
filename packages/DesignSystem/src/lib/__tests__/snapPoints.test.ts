import { describe, it, expect } from 'vitest'
import { snapPointToPixels } from '../../components/fixedModalSheet'
import { snapPointTestCases } from '../../test/helpers'

describe('snapPointToPixels', () => {
    const WINDOW_HEIGHT = 1000

    describe('standard conversions', () => {
        const testCases = snapPointTestCases(WINDOW_HEIGHT)

        testCases.forEach(({ input, windowHeight, expected, desc }) => {
            it(`${desc}: snapPointToPixels(${JSON.stringify(input)}, ${windowHeight}) = ${expected}`, () => {
                expect(snapPointToPixels(input, windowHeight)).toBe(expected)
            })
        })
    })

    describe('decimal number handling', () => {
        it('treats 0 < n <= 1 as percentage', () => {
            expect(snapPointToPixels(0.1, 1000)).toBe(100)
            expect(snapPointToPixels(0.25, 1000)).toBe(250)
            expect(snapPointToPixels(1, 1000)).toBe(1000)
        })

        it('treats n > 1 as pixel value', () => {
            expect(snapPointToPixels(2, 1000)).toBe(2)
            expect(snapPointToPixels(100, 1000)).toBe(100)
            expect(snapPointToPixels(500, 800)).toBe(500)
        })

        it('handles zero correctly', () => {
            expect(snapPointToPixels(0, 1000)).toBe(0)
        })
    })

    describe('string format parsing', () => {
        it('parses vh units', () => {
            expect(snapPointToPixels('100vh', 800)).toBe(800)
            expect(snapPointToPixels('25vh', 800)).toBe(200)
            expect(snapPointToPixels('0vh', 1000)).toBe(0)
        })

        it('parses px units', () => {
            expect(snapPointToPixels('500px', 1000)).toBe(500)
            expect(snapPointToPixels('0px', 1000)).toBe(0)
            expect(snapPointToPixels('1234px', 500)).toBe(1234)
        })

        it('parses percent units', () => {
            expect(snapPointToPixels('50%', 1000)).toBe(500)
            expect(snapPointToPixels('100%', 800)).toBe(800)
            expect(snapPointToPixels('0%', 1000)).toBe(0)
        })

        it('falls back to parseFloat for unknown format', () => {
            expect(snapPointToPixels('500', 1000)).toBe(500)
            expect(snapPointToPixels('0', 1000)).toBe(0)
        })
    })

    describe('with different window heights', () => {
        it('scales correctly with window height', () => {
            expect(snapPointToPixels(0.5, 500)).toBe(250)
            expect(snapPointToPixels(0.5, 2000)).toBe(1000)
            expect(snapPointToPixels('50vh', 500)).toBe(250)
            expect(snapPointToPixels('50%', 2000)).toBe(1000)
        })

        it('pixel values are independent of window height', () => {
            expect(snapPointToPixels(400, 500)).toBe(400)
            expect(snapPointToPixels(400, 2000)).toBe(400)
            expect(snapPointToPixels('400px', 500)).toBe(400)
            expect(snapPointToPixels('400px', 2000)).toBe(400)
        })
    })
})

