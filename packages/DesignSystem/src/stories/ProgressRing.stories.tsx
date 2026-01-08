import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressRing } from '@/components/progressRing';

const meta = {
  title: 'Components/ProgressRing',
  component: ProgressRing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      control: { type: 'range', min: 24, max: 120, step: 4 },
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 8, step: 0.5 },
    },
    showTrack: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof ProgressRing>;

export const Default: Story = {
  args: {
    value: 75,
    size: 48,
    strokeWidth: 2,
    color: 'stroke-gold',
  },
};

export const WithTrack: Story = {
  args: {
    value: 60,
    size: 64,
    strokeWidth: 4,
    color: 'stroke-gold',
    showTrack: true,
  },
};

export const WithContent: Story = {
  args: {
    value: 85,
    size: 80,
    strokeWidth: 4,
    color: 'stroke-emerald-500',
    showTrack: true,
    children: <span className="text-lg font-bold text-foreground">85%</span>,
  },
};

export const ProgressValues: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={0} size={48} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">0%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={25} size={48} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">25%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={50} size={48} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">50%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={48} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">75%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={100} size={48} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">100%</span>
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={32} strokeWidth={2} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={48} strokeWidth={2} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">48px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={64} strokeWidth={3} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">64px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={96} strokeWidth={4} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">96px</span>
      </div>
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div className="flex gap-6">
      <ProgressRing value={75} size={48} color="stroke-gold" />
      <ProgressRing value={75} size={48} color="stroke-blue-500" />
      <ProgressRing value={75} size={48} color="stroke-emerald-500" />
      <ProgressRing value={75} size={48} color="stroke-rose-500" />
      <ProgressRing value={75} size={48} color="stroke-purple-500" />
      <ProgressRing value={75} size={48} color="stroke-amber-500" />
    </div>
  ),
};

export const StrokeWidths: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={48} strokeWidth={1} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">1px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={48} strokeWidth={2} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">2px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={48} strokeWidth={4} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">4px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size={48} strokeWidth={6} color="stroke-gold" />
        <span className="text-xs text-foreground-secondary">6px</span>
      </div>
    </div>
  ),
};

export const AroundContent: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="relative">
        <ProgressRing value={65} size={64} strokeWidth={3} color="stroke-gold" showTrack>
          <div className="flex flex-col items-center justify-center w-10 h-10 bg-surface rounded-full text-xl">
            🔥
          </div>
        </ProgressRing>
      </div>
      
      <div className="relative">
        <ProgressRing value={42} size={64} strokeWidth={3} color="stroke-blue-500" showTrack>
          <div className="flex flex-col items-center justify-center w-10 h-10 bg-surface rounded-full text-xl">
            💧
          </div>
        </ProgressRing>
      </div>
      
      <div className="relative">
        <ProgressRing value={88} size={64} strokeWidth={3} color="stroke-emerald-500" showTrack>
          <div className="flex flex-col items-center justify-center w-10 h-10 bg-surface rounded-full text-xl">
            🏃
          </div>
        </ProgressRing>
      </div>
    </div>
  ),
};

export const DayButtonExample: Story = {
  render: () => (
    <div className="flex gap-3">
      {[
        { day: 'Mon', date: 6, progress: 100 },
        { day: 'Tue', date: 7, progress: 85 },
        { day: 'Wed', date: 8, progress: 60 },
        { day: 'Thu', date: 9, progress: 30 },
        { day: 'Fri', date: 10, progress: 0 },
      ].map(({ day, date, progress }) => (
        <div key={day} className="relative">
          <ProgressRing 
            value={progress} 
            size={48} 
            strokeWidth={2} 
            color="stroke-gold"
            className="absolute inset-0 pointer-events-none z-10"
          />
          <button className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-surface text-muted-foreground hover:bg-muted hover:text-white transition-colors">
            <span className="text-[8px] font-medium uppercase leading-tight">{day}</span>
            <span className="text-sm font-bold leading-tight">{date}</span>
          </button>
        </div>
      ))}
    </div>
  ),
};

