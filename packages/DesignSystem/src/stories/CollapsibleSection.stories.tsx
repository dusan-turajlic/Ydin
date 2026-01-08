import type { Meta, StoryObj } from '@storybook/react-vite';

import { CollapsibleSection } from '@/components/collapsibleSection';
import { NutrientRow } from '@/components/nutrientRow';

const meta = {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof CollapsibleSection>;

export const Default: Story = {
  args: {
    title: 'Section Title',
    children: (
      <p className="text-foreground-secondary">
        This is the collapsible content. Click the header to toggle visibility.
      </p>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export const DefaultOpen: Story = {
  args: {
    title: 'Open by Default',
    defaultOpen: true,
    children: (
      <p className="text-foreground-secondary">
        This section starts expanded because defaultOpen is set to true.
      </p>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export const WithCustomTitleColor: Story = {
  args: {
    title: 'Vitamins',
    titleColor: 'text-emerald-500',
    defaultOpen: true,
    children: (
      <div className="space-y-2">
        <NutrientRow label="Vitamin A" value={450} target={900} unit="μg" color="bg-emerald-500" />
        <NutrientRow label="Vitamin C" value={65} target={90} unit="mg" color="bg-emerald-500" />
        <NutrientRow label="Vitamin D" value={8} target={20} unit="μg" color="bg-emerald-500" />
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export const MultipleSections: Story = {
  render: () => (
    <div className="w-96 space-y-0">
      <CollapsibleSection title="Macronutrients" defaultOpen>
        <div className="space-y-2">
          <NutrientRow label="Protein" value={85} target={150} unit="g" color="bg-blue-500" />
          <NutrientRow label="Carbohydrates" value={180} target={250} unit="g" color="bg-amber-500" />
          <NutrientRow label="Fat" value={55} target={70} unit="g" color="bg-rose-500" />
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Vitamins">
        <div className="space-y-2">
          <NutrientRow label="Vitamin A" value={450} target={900} unit="μg" color="bg-emerald-500" />
          <NutrientRow label="Vitamin C" value={65} target={90} unit="mg" color="bg-emerald-500" />
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Minerals">
        <div className="space-y-2">
          <NutrientRow label="Iron" value={12} target={18} unit="mg" color="bg-purple-500" />
          <NutrientRow label="Calcium" value={800} target={1000} unit="mg" color="bg-purple-500" />
        </div>
      </CollapsibleSection>
    </div>
  ),
};

export const WithRichContent: Story = {
  args: {
    title: 'Product Details',
    defaultOpen: true,
    children: (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
            🥗
          </div>
          <div>
            <p className="font-medium text-foreground">Caesar Salad</p>
            <p className="text-sm text-foreground-secondary">Lunch • 350 kcal</p>
          </div>
        </div>
        <p className="text-sm text-foreground-secondary">
          A classic Caesar salad with romaine lettuce, parmesan cheese, croutons, 
          and our signature Caesar dressing.
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

