import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, InlineSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders when show is true', () => {
        render(<LoadingSpinner show={true} />);

        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders by default without show prop', () => {
        render(<LoadingSpinner />);

        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
        render(<LoadingSpinner show={false} />);

        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('has default screen reader text', () => {
        render(<LoadingSpinner />);

        expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    it('uses custom screen reader text', () => {
        render(<LoadingSpinner srText="Please wait..." />);

        expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('applies small size classes', () => {
        const { container } = render(<LoadingSpinner size="sm" />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('h-6');
        expect(spinner?.className).toContain('w-6');
        expect(spinner?.className).toContain('border-2');
    });

    it('applies medium size classes by default', () => {
        const { container } = render(<LoadingSpinner />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('h-10');
        expect(spinner?.className).toContain('w-10');
        expect(spinner?.className).toContain('border-4');
    });

    it('applies large size classes', () => {
        const { container } = render(<LoadingSpinner size="lg" />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('h-12');
        expect(spinner?.className).toContain('w-12');
    });

    it('applies primary variant classes by default', () => {
        const { container } = render(<LoadingSpinner />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-surface-elevated');
        expect(spinner?.className).toContain('border-t-brand-gold');
    });

    it('applies secondary variant classes', () => {
        const { container } = render(<LoadingSpinner variant="secondary" />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-surface-elevated');
        expect(spinner?.className).toContain('border-t-white');
    });

    it('applies emerald variant classes', () => {
        const { container } = render(<LoadingSpinner variant="emerald" />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-t-emerald-500');
    });

    it('has aria-live polite for accessibility', () => {
        render(<LoadingSpinner />);

        expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
});

describe('InlineSpinner', () => {
    it('renders with default props', () => {
        const { container } = render(<InlineSpinner />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('uses emerald variant by default', () => {
        const { container } = render(<InlineSpinner />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-t-emerald-500');
    });

    it('uses medium size by default', () => {
        const { container } = render(<InlineSpinner />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('h-10');
        expect(spinner?.className).toContain('w-10');
    });

    it('accepts custom size', () => {
        const { container } = render(<InlineSpinner size="sm" />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('h-6');
        expect(spinner?.className).toContain('w-6');
    });

    it('accepts custom variant', () => {
        const { container } = render(<InlineSpinner variant="primary" />);

        const spinner = container.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-t-brand-gold');
    });
});

