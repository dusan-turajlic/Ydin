import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heart, Star, ShoppingCart } from 'lucide-react';

import { Ripple } from '@/components/ripple';

const meta = {
  title: 'Components/Ripple',
  component: Ripple,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'color',
    },
    duration: {
      control: { type: 'range', min: 200, max: 1500, step: 100 },
    },
    rounded: {
      control: 'select',
      options: [true, false, 'full', 'lg', 'md', 'sm', 'none'],
    },
  },
} satisfies Meta<typeof Ripple>;

export default meta;
type Story = StoryObj<typeof Ripple>;

export const Default: Story = {
  args: {
    color: 'rgba(255, 255, 255, 0.4)',
    children: (
      <button className="px-6 py-3 bg-gold text-background font-medium rounded-full">
        Click me
      </button>
    ),
  },
};

export const OnCard: Story = {
  render: () => (
    <Ripple color="rgba(255, 255, 255, 0.2)" rounded="lg">
      <div className="p-4 bg-surface rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-xl">
            🍕
          </div>
          <div>
            <p className="font-medium text-foreground">Pizza Margherita</p>
            <p className="text-sm text-foreground-secondary">285 kcal • 1 slice</p>
          </div>
        </div>
      </div>
    </Ripple>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Ripple color="rgba(239, 68, 68, 0.3)">
        <button className="p-3 bg-surface rounded-full border border-border hover:bg-muted transition-colors">
          <Heart className="h-5 w-5 text-red-500" />
        </button>
      </Ripple>
      
      <Ripple color="rgba(234, 179, 8, 0.3)">
        <button className="p-3 bg-surface rounded-full border border-border hover:bg-muted transition-colors">
          <Star className="h-5 w-5 text-yellow-500" />
        </button>
      </Ripple>
      
      <Ripple color="rgba(59, 130, 246, 0.3)">
        <button className="p-3 bg-surface rounded-full border border-border hover:bg-muted transition-colors">
          <ShoppingCart className="h-5 w-5 text-blue-500" />
        </button>
      </Ripple>
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div className="flex gap-4">
      <Ripple color="rgba(255, 255, 255, 0.5)">
        <button className="px-4 py-2 bg-slate-700 text-white rounded-lg">
          White
        </button>
      </Ripple>
      
      <Ripple color="rgba(59, 130, 246, 0.5)">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Blue
        </button>
      </Ripple>
      
      <Ripple color="rgba(16, 185, 129, 0.5)">
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg">
          Green
        </button>
      </Ripple>
      
      <Ripple color="rgba(239, 68, 68, 0.5)">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Red
        </button>
      </Ripple>
    </div>
  ),
};

export const DifferentShapes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Ripple color="rgba(255, 255, 255, 0.3)" rounded="full">
        <button className="px-4 py-2 bg-surface border border-border rounded-full">
          Pill
        </button>
      </Ripple>
      
      <Ripple color="rgba(255, 255, 255, 0.3)" rounded="lg">
        <button className="px-4 py-2 bg-surface border border-border rounded-lg">
          Rounded
        </button>
      </Ripple>
      
      <Ripple color="rgba(255, 255, 255, 0.3)" rounded="sm">
        <button className="px-4 py-2 bg-surface border border-border rounded-sm">
          Small radius
        </button>
      </Ripple>
      
      <Ripple color="rgba(255, 255, 255, 0.3)" rounded="none">
        <button className="px-4 py-2 bg-surface border border-border">
          Square
        </button>
      </Ripple>
    </div>
  ),
};

export const ListItems: Story = {
  render: () => (
    <div className="w-80 bg-surface rounded-lg border border-border overflow-hidden">
      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, i) => (
        <Ripple key={meal} color="rgba(255, 255, 255, 0.1)" rounded="none">
          <div 
            className={`px-4 py-3 cursor-pointer hover:bg-muted transition-colors ${
              i < 3 ? 'border-b border-border' : ''
            }`}
          >
            <p className="font-medium text-foreground">{meal}</p>
            <p className="text-sm text-foreground-secondary">0 items</p>
          </div>
        </Ripple>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    color: 'rgba(255, 255, 255, 0.4)',
    disabled: true,
    children: (
      <button className="px-6 py-3 bg-muted text-foreground-secondary font-medium rounded-full opacity-50 cursor-not-allowed">
        Disabled
      </button>
    ),
  },
};

export const SlowAnimation: Story = {
  args: {
    color: 'rgba(255, 255, 255, 0.4)',
    duration: 1200,
    children: (
      <button className="px-6 py-3 bg-gold text-background font-medium rounded-full">
        Slow ripple (1.2s)
      </button>
    ),
  },
};

