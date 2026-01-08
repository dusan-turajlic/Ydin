import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { DayButton } from '@/components/dayButton';

const meta = {
    title: 'Components/DayButton',
    component: DayButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        day: {
            control: 'text',
            description: 'Day abbreviation (e.g., MON, TUE)',
        },
        date: {
            control: { type: 'number', min: 1, max: 31 },
            description: 'Day of the month',
        },
        active: {
            control: 'boolean',
            description: 'Whether the day is selected/active',
        },
        progress: {
            control: { type: 'number', min: 0, max: 100 },
            description: 'Progress percentage (0-100, capped)',
        },
    },
    args: {
        day: 'FRI',
        date: 26,
        active: false,
        progress: 0,
        onPress: fn(),
    },
} satisfies Meta<typeof DayButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default interactive story
export const Default: Story = {
    args: {
        day: 'FRI',
        date: 26,
        active: false,
        progress: 0,
    },
};

// Day Selector Row
export const DaySelector: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Day Selector Buttons</p>
            </div>
            <div className="flex gap-3">
                <DayButton day="MON" date={22} />
                <DayButton day="TUE" date={23} />
                <DayButton day="WED" date={24} />
                <DayButton day="THU" date={25} />
                <DayButton day="FRI" date={26} active />
                <DayButton day="SAT" date={27} />
                <DayButton day="SUN" date={28} />
            </div>
        </div>
    ),
};

// With Progress Rings
export const WithProgress: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Day Selector with Progress</p>
                <p className="text-sm text-foreground-secondary">
                    Circular progress ring in Primary Gold wraps around the day button. Progress is capped at 0-100%.
                </p>
            </div>
            <div className="flex gap-3">
                <DayButton day="MON" date={22} progress={0} />
                <DayButton day="TUE" date={23} progress={25} />
                <DayButton day="WED" date={24} progress={50} />
                <DayButton day="THU" date={25} progress={75} />
                <DayButton day="FRI" date={26} progress={100} active />
                <DayButton day="SAT" date={27} progress={150} />
                <DayButton day="SUN" date={28} progress={200} />
            </div>
            <p className="text-xs text-foreground-secondary">
                Note: Saturday shows progress=150 and Sunday shows progress=200, both capped at 100% maximum.
            </p>
        </div>
    ),
};

// Active State
export const Active: Story = {
    args: {
        day: 'FRI',
        date: 26,
        active: true,
        progress: 0,
    },
};

// Inactive State
export const Inactive: Story = {
    args: {
        day: 'MON',
        date: 22,
        active: false,
        progress: 0,
    },
};

// With Full Progress
export const FullProgress: Story = {
    args: {
        day: 'WED',
        date: 24,
        active: false,
        progress: 100,
    },
};

// Active with Progress
export const ActiveWithProgress: Story = {
    args: {
        day: 'FRI',
        date: 26,
        active: true,
        progress: 75,
    },
};

// Progress States
export const ProgressStates: Story = {
    render: () => (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Progress States</p>
            </div>
            <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                    <DayButton day="0%" date={1} progress={0} />
                    <span className="text-xs text-muted-foreground">0%</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <DayButton day="25%" date={2} progress={25} />
                    <span className="text-xs text-muted-foreground">25%</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <DayButton day="50%" date={3} progress={50} />
                    <span className="text-xs text-muted-foreground">50%</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <DayButton day="75%" date={4} progress={75} />
                    <span className="text-xs text-muted-foreground">75%</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <DayButton day="100%" date={5} progress={100} />
                    <span className="text-xs text-muted-foreground">100%</span>
                </div>
            </div>
        </div>
    ),
};

