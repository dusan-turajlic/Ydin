import { describe, it, expect } from 'vitest';
import { getPercentageBadgeColor, getMacroColor, MACRO_COLORS } from '../colors';

describe('getPercentageBadgeColor', () => {
    it('returns red for percentages 15 or below', () => {
        expect(getPercentageBadgeColor(0)).toBe('bg-red-600');
        expect(getPercentageBadgeColor(10)).toBe('bg-red-600');
        expect(getPercentageBadgeColor(15)).toBe('bg-red-600');
    });

    it('returns yellow for percentages between 16 and 40', () => {
        expect(getPercentageBadgeColor(16)).toBe('bg-amber-600');
        expect(getPercentageBadgeColor(25)).toBe('bg-amber-600');
        expect(getPercentageBadgeColor(40)).toBe('bg-amber-600');
    });

    it('returns green for percentages above 40', () => {
        expect(getPercentageBadgeColor(41)).toBe('bg-emerald-600');
        expect(getPercentageBadgeColor(60)).toBe('bg-emerald-600');
        expect(getPercentageBadgeColor(100)).toBe('bg-emerald-600');
    });

    it('handles negative percentages', () => {
        expect(getPercentageBadgeColor(-10)).toBe('bg-red-600');
    });

    it('handles percentages over 100', () => {
        expect(getPercentageBadgeColor(150)).toBe('bg-emerald-600');
    });
});

describe('getMacroColor', () => {
    it('returns correct color for calories', () => {
        expect(getMacroColor('calories')).toBe('#E4B962');
    });

    it('returns correct color for protein', () => {
        expect(getMacroColor('protein')).toBe('#F87171');
    });

    it('returns correct color for fat', () => {
        expect(getMacroColor('fat')).toBe('#FBBF24');
    });

    it('returns correct color for carbs', () => {
        expect(getMacroColor('carbs')).toBe('#34D399');
    });

    it('returns correct color for fiber', () => {
        expect(getMacroColor('fiber')).toBe('#34D399');
    });
});

describe('MACRO_COLORS', () => {
    it('has all expected macro types', () => {
        expect(MACRO_COLORS).toHaveProperty('calories');
        expect(MACRO_COLORS).toHaveProperty('protein');
        expect(MACRO_COLORS).toHaveProperty('fat');
        expect(MACRO_COLORS).toHaveProperty('carbs');
        expect(MACRO_COLORS).toHaveProperty('fiber');
    });

    it('fiber and carbs have the same color', () => {
        expect(MACRO_COLORS.fiber).toBe(MACRO_COLORS.carbs);
    });

    it('all colors are valid hex codes', () => {
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;
        Object.values(MACRO_COLORS).forEach(color => {
            expect(color).toMatch(hexPattern);
        });
    });
});

