import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FoodCard } from '@/components/foodCard';

const meta = {
  title: 'Components/FoodCard',
  component: FoodCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FoodCard>;

export default meta;
type Story = StoryObj<typeof FoodCard>;

export const Default: Story = {
  args: {
    title: 'Grilled Chicken Breast',
    emoji: '🍗',
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    serving: '100g',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export const Selected: Story = {
  args: {
    title: 'Greek Yogurt',
    emoji: '🥛',
    calories: 100,
    protein: 17,
    fat: 0.7,
    carbs: 6,
    serving: '170g',
    selected: true,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <div className="w-96">
        <FoodCard
          title="Avocado"
          emoji="🥑"
          calories={160}
          protein={2}
          fat={15}
          carbs={9}
          serving="100g"
          selected={selected}
          onToggle={() => setSelected(!selected)}
        />
        <p className="mt-4 text-sm text-foreground-secondary text-center">
          {selected ? 'Added to meal' : 'Click + to add'}
        </p>
      </div>
    );
  },
};

export const FoodList: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    
    const foods = [
      { id: '1', title: 'Grilled Chicken Breast', emoji: '🍗', calories: 165, protein: 31, fat: 3.6, carbs: 0, serving: '100g' },
      { id: '2', title: 'Brown Rice', emoji: '🍚', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, serving: '100g' },
      { id: '3', title: 'Broccoli', emoji: '🥦', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, serving: '100g' },
      { id: '4', title: 'Salmon Fillet', emoji: '🐟', calories: 208, protein: 20, fat: 13, carbs: 0, serving: '100g' },
    ];
    
    const toggleFood = (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    };
    
    return (
      <div className="w-96 space-y-2">
        {foods.map(food => (
          <FoodCard
            key={food.id}
            {...food}
            selected={selectedIds.has(food.id)}
            onToggle={() => toggleFood(food.id)}
          />
        ))}
        <p className="mt-4 text-sm text-foreground-secondary text-center">
          {selectedIds.size} items selected
        </p>
      </div>
    );
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Organic Free-Range Chicken Caesar Salad with Parmesan',
    emoji: '🥗',
    calories: 420,
    protein: 35,
    fat: 28,
    carbs: 12,
    serving: '1 bowl (350g)',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

