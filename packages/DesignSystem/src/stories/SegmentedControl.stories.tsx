import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedControl } from '@/ui/segmentedControl';

const meta = {
  title: 'UI/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default'],
      description: 'Size variant',
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

function DefaultExample() {
  const [value, setValue] = useState('option1');
  return (
    <SegmentedControl
      aria-label="Select option"
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export const Default: Story = {
  render: () => <DefaultExample />,
};

function SizesExample() {
  const [value1, setValue1] = useState('cm');
  const [value2, setValue2] = useState('cm');
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
        <SegmentedControl
          aria-label="Height unit"
          options={[
            { value: 'cm', label: 'CM' },
            { value: 'ft', label: 'FT' },
          ]}
          value={value1}
          onChange={setValue1}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Small</p>
        <SegmentedControl
          size="sm"
          aria-label="Height unit"
          options={[
            { value: 'cm', label: 'CM' },
            { value: 'ft', label: 'FT' },
          ]}
          value={value2}
          onChange={setValue2}
        />
      </div>
    </div>
  );
}

export const Sizes: Story = {
  render: () => <SizesExample />,
};

function UnitToggleExample() {
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Height Unit</p>
        <SegmentedControl
          size="sm"
          aria-label="Height unit"
          options={[
            { value: 'cm', label: 'CM' },
            { value: 'ft', label: 'FT' },
          ]}
          value={heightUnit}
          onChange={setHeightUnit}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight Unit</p>
        <SegmentedControl
          size="sm"
          aria-label="Weight unit"
          options={[
            { value: 'kg', label: 'KG' },
            { value: 'lbs', label: 'LBS' },
          ]}
          value={weightUnit}
          onChange={setWeightUnit}
        />
      </div>
    </div>
  );
}

export const UnitToggle: Story = {
  render: () => <UnitToggleExample />,
};

function ManyOptionsExample() {
  const [value, setValue] = useState('day');
  return (
    <SegmentedControl
      aria-label="Time period"
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export const ManyOptions: Story = {
  render: () => <ManyOptionsExample />,
};

function TwoOptionsExample() {
  const [value, setValue] = useState('on');
  return (
    <SegmentedControl
      aria-label="Toggle"
      options={[
        { value: 'on', label: 'On' },
        { value: 'off', label: 'Off' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export const TwoOptions: Story = {
  render: () => <TwoOptionsExample />,
};
