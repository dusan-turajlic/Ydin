import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ScanBarcode, Camera, Mic } from 'lucide-react';

import { SearchInput } from '@/components/searchInput';
import { FoodCard } from '@/components/foodCard';
import { Button } from '@/ui/button';

// Action button options for the control
const actionOptions = {
    none: undefined,
    scanner: (
        <Button variant="icon" size="icon-sm" aria-label="Scan barcode">
            <ScanBarcode className="h-4 w-4" />
        </Button>
    ),
    camera: (
        <Button variant="icon" size="icon-sm" aria-label="Take photo">
            <Camera className="h-4 w-4" />
        </Button>
    ),
    mic: (
        <Button variant="icon" size="icon-sm" aria-label="Voice search">
            <Mic className="h-4 w-4" />
        </Button>
    ),
};

const meta = {
    title: 'Components/SearchInput',
    component: SearchInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        isDisabled: {
            control: 'boolean',
            description: 'Disabled state',
        },
        action: {
            control: 'select',
            options: Object.keys(actionOptions),
            mapping: actionOptions,
            description: 'Action button on the right side',
        },
    },
    args: {
        placeholder: 'Search for a food',
        onSearch: fn(),
    },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default interactive story
export const Default: Story = {
    args: {
        placeholder: 'Search for a food',
        action: 'none' as unknown as React.ReactNode,
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
};

// Search Input Showcase
export const Showcase: Story = {
    render: () => (
        <div className="space-y-8 w-96">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Search Input</p>
                <p className="text-sm text-foreground-secondary">
                    Search input with gold focus ring and icon. Used throughout the app for food search functionality.
                </p>
            </div>
            <SearchInput placeholder="Search for a food" />
        </div>
    ),
};

// With Scanner Action
export const WithScanner: Story = {
    render: () => (
        <div className="space-y-8 w-96">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With Scanner Button</p>
                <p className="text-sm text-foreground-secondary">
                    Search input with a barcode scanner button on the right.
                </p>
            </div>
            <SearchInput
                placeholder="Search or scan"
                action={
                    <Button variant="icon" size="icon-sm" aria-label="Scan barcode">
                        <ScanBarcode className="h-4 w-4" />
                    </Button>
                }
            />
        </div>
    ),
};


// Different Placeholders
export const Placeholders: Story = {
    render: () => (
        <div className="space-y-8 w-96">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Different Placeholders</p>
            </div>
            <div className="space-y-4">
                <SearchInput placeholder="Search for a food" />
                <SearchInput placeholder="Find recipes..." />
                <SearchInput placeholder="Search meals" />
                <SearchInput placeholder="Type to search" />
            </div>
        </div>
    ),
};

// Disabled State
export const Disabled: Story = {
    args: {
        placeholder: 'Search disabled',
        isDisabled: true,
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
};

// With Value
export const WithValue: Story = {
    args: {
        placeholder: 'Search for a food',
        defaultValue: 'Oat Flakes',
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
};

// Food Search Interface Example
export const FoodSearchInterface: Story = {
    render: () => (
        <div className="space-y-8 w-[500px]">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Food Search Interface</p>
                <p className="text-sm text-foreground-secondary">
                    Complete search interface with results.
                </p>
            </div>
            <div className="bg-background rounded-xl p-6 space-y-6 border border-border">
                <SearchInput placeholder="Search for a food" />
                <div className="space-y-3">
                    <FoodCard
                        title="Oat Flakes Fine By Crownfield"
                        emoji="🥣"
                        calories={146}
                        protein={6}
                        fat={3}
                        carbs={22}
                        serving="40 g"
                    />
                    <FoodCard
                        title="Banana"
                        emoji="🍌"
                        calories={89}
                        protein={1}
                        fat={0}
                        carbs={23}
                        serving="100 g"
                    />
                    <FoodCard
                        title="Whole Milk"
                        emoji="🥛"
                        calories={61}
                        protein={3}
                        fat={3}
                        carbs={5}
                        serving="100 ml"
                    />
                </div>
            </div>
        </div>
    ),
};
