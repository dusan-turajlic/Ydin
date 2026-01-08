import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Plus, Check, X, Edit, Search } from 'lucide-react';

import { Button } from '@/ui/button';

const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'icon'],
            description: 'Visual style variant',
        },
        size: {
            control: 'select',
            options: ['xl', 'lg', 'default', 'sm', 'xs', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
            description: 'Size variant',
        },
        isDisabled: {
            control: 'boolean',
            description: 'Disabled state',
        },
    },
    args: {
        children: 'Button',
        variant: 'default',
        size: 'default',
        onPress: fn(),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default interactive story
export const Default: Story = {
    args: {
        children: 'Button',
        variant: 'default',
        size: 'default',
    },
};

// All Size Variants
export const Sizes: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Large</p>
                <Button size="xl">Extra Large</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Large</p>
                <Button size="lg">Large Button</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
                <Button>Default Button</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Small</p>
                <Button size="sm">Small Button</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Small</p>
                <Button size="xs">Extra Small</Button>
            </div>
        </div>
    ),
};

// All Variants
export const Variants: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default (Primary Gold)</p>
                <Button variant="default">Primary Gold</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Secondary</p>
                <Button variant="secondary">Secondary</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Outline</p>
                <Button variant="outline">Outline</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ghost</p>
                <Button variant="ghost">Ghost</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Link</p>
                <Button variant="link">Link Button</Button>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Destructive</p>
                <Button variant="destructive">Destructive</Button>
            </div>
        </div>
    ),
};

// Icon Buttons
export const IconButtons: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon Sizes</p>
                <div className="flex gap-4 items-center">
                    <Button variant="icon" size="icon-lg" aria-label="Add item">
                        <Plus className="h-5 w-5" />
                    </Button>
                    <Button variant="icon" size="icon" aria-label="Add item">
                        <Plus className="h-5 w-5" />
                    </Button>
                    <Button variant="icon" size="icon-sm" aria-label="Add item">
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="icon" size="icon-xs" aria-label="Add item">
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon Types</p>
                <div className="flex gap-4 items-center">
                    <Button variant="icon" size="icon" aria-label="Add">
                        <Plus className="h-5 w-5" />
                    </Button>
                    <Button variant="icon" size="icon" aria-label="Confirm">
                        <Check className="h-5 w-5" />
                    </Button>
                    <Button variant="icon" size="icon" aria-label="Close">
                        <X className="h-5 w-5" />
                    </Button>
                    <Button variant="icon" size="icon" aria-label="Edit">
                        <Edit className="h-5 w-5" />
                    </Button>
                    <Button variant="icon" size="icon" aria-label="Search">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    ),
};

// Buttons with Icons (icon + text)
export const WithIcons: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon + Text Combinations</p>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button size="lg">
                        <Plus className="h-4 w-4" />
                        Add Item
                    </Button>
                    <Button variant="secondary">
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                    <Button variant="outline">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive">
                        <X className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    ),
};

// Individual variant stories
export const Primary: Story = {
    args: {
        children: 'Primary Gold',
        variant: 'default',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        variant: 'outline',
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost',
        variant: 'ghost',
    },
};

export const Link: Story = {
    args: {
        children: 'Link Button',
        variant: 'link',
    },
};

export const Destructive: Story = {
    args: {
        children: 'Destructive',
        variant: 'destructive',
    },
};

// Individual size stories
export const ExtraLarge: Story = {
    args: {
        children: 'Extra Large',
        size: 'xl',
    },
};

export const Large: Story = {
    args: {
        children: 'Large',
        size: 'lg',
    },
};

export const Small: Story = {
    args: {
        children: 'Small',
        size: 'sm',
    },
};

export const ExtraSmall: Story = {
    args: {
        children: 'Extra Small',
        size: 'xs',
    },
};

// Disabled state
export const Disabled: Story = {
    args: {
        children: 'Disabled',
        isDisabled: true,
    },
};
