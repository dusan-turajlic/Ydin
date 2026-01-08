import type { Meta, StoryObj } from '@storybook/react-vite';

import { NutrientRow } from '@/components/nutrientRow';

const meta = {
  title: 'Components/NutrientRow',
  component: NutrientRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NutrientRow>;

export default meta;
type Story = StoryObj<typeof NutrientRow>;

export const Default: Story = {
  args: {
    label: 'Protein',
    value: 85,
    target: 150,
    unit: 'g',
    color: 'bg-blue-500',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithoutTarget: Story = {
  args: {
    label: 'Sodium',
    value: 1200,
    unit: 'mg',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const FullProgress: Story = {
  args: {
    label: 'Vitamin C',
    value: 95,
    target: 90,
    unit: 'mg',
    color: 'bg-emerald-500',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const LowProgress: Story = {
  args: {
    label: 'Fiber',
    value: 8,
    target: 30,
    unit: 'g',
    color: 'bg-amber-500',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const DecimalValues: Story = {
  args: {
    label: 'Vitamin B12',
    value: 1.8,
    target: 2.4,
    unit: 'μg',
    color: 'bg-purple-500',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const NutrientList: Story = {
  render: () => (
    <div className="w-80 space-y-0">
      <NutrientRow label="Protein" value={85} target={150} unit="g" color="bg-blue-500" />
      <NutrientRow label="Carbohydrates" value={180} target={250} unit="g" color="bg-amber-500" />
      <NutrientRow label="Fat" value={55} target={70} unit="g" color="bg-rose-500" />
      <NutrientRow label="Fiber" value={18} target={30} unit="g" color="bg-emerald-500" />
      <NutrientRow label="Sodium" value={1800} unit="mg" />
      <NutrientRow label="Sugar" value={25} target={50} unit="g" color="bg-pink-500" />
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="w-80 space-y-0">
      <NutrientRow label="Iron" value={12} target={18} unit="mg" color="bg-red-600" />
      <NutrientRow label="Calcium" value={800} target={1000} unit="mg" color="bg-cyan-500" />
      <NutrientRow label="Vitamin D" value={15} target={20} unit="μg" color="bg-yellow-500" />
      <NutrientRow label="Zinc" value={8} target={11} unit="mg" color="bg-indigo-500" />
    </div>
  ),
};

