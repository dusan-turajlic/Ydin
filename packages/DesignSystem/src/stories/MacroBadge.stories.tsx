import type { Meta, StoryObj } from '@storybook/react-vite';

import { MacroBadge } from '@/components/macroBadge';

const meta = {
  title: 'Components/MacroBadge',
  component: MacroBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MacroBadge>;

export default meta;
type Story = StoryObj<typeof MacroBadge>;

export const Default: Story = {
  args: {
    value: 1847,
    label: 'Cal',
    color: 'bg-gold',
  },
};

export const WithUnit: Story = {
  args: {
    value: 142,
    label: 'Protein',
    color: 'bg-blue-500',
    unit: 'g',
  },
};

export const AllMacros: Story = {
  render: () => (
    <div className="flex gap-8">
      <MacroBadge value={1847} label="Cal" color="bg-gold" />
      <MacroBadge value={142} label="Prot" color="bg-blue-500" unit="g" />
      <MacroBadge value={65} label="Fat" color="bg-rose-500" unit="g" />
      <MacroBadge value={180} label="Carbs" color="bg-amber-500" unit="g" />
    </div>
  ),
};

export const DecimalValues: Story = {
  render: () => (
    <div className="flex gap-8">
      <MacroBadge value={15.5} label="Fat" color="bg-rose-500" unit="g" />
      <MacroBadge value={2.3} label="Fiber" color="bg-emerald-500" unit="g" />
      <MacroBadge value={0.8} label="Sugar" color="bg-amber-500" unit="g" />
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex gap-8">
      <MacroBadge value={450} label="Iron" color="bg-purple-500" unit="μg" />
      <MacroBadge value={800} label="Calcium" color="bg-cyan-500" unit="mg" />
      <MacroBadge value={3500} label="Potassium" color="bg-orange-500" unit="mg" />
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="p-6 bg-surface rounded-xl border border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
          🍗
        </div>
        <div>
          <p className="font-medium text-foreground">Grilled Chicken</p>
          <p className="text-sm text-foreground-secondary">100g serving</p>
        </div>
      </div>
      <div className="flex justify-between pt-4 border-t border-border">
        <MacroBadge value={165} label="Cal" color="bg-gold" />
        <MacroBadge value={31} label="Prot" color="bg-blue-500" unit="g" />
        <MacroBadge value={3.6} label="Fat" color="bg-rose-500" unit="g" />
        <MacroBadge value={0} label="Carbs" color="bg-amber-500" unit="g" />
      </div>
    </div>
  ),
};

