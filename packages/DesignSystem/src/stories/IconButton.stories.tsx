import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from '@/components/iconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['plus', 'close', 'check', 'search', 'edit', 'calendar', 'menu', 'chart'],
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'icon'],
    },
    size: {
      control: 'select',
      options: ['icon-xs', 'icon-sm', 'icon', 'icon-lg'],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: 'plus',
    label: 'Add item',
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="plus" label="Add" />
        <span className="text-xs text-foreground-secondary">plus</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="close" label="Close" />
        <span className="text-xs text-foreground-secondary">close</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="check" label="Check" />
        <span className="text-xs text-foreground-secondary">check</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="search" label="Search" />
        <span className="text-xs text-foreground-secondary">search</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="edit" label="Edit" />
        <span className="text-xs text-foreground-secondary">edit</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="calendar" label="Calendar" />
        <span className="text-xs text-foreground-secondary">calendar</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="menu" label="Menu" />
        <span className="text-xs text-foreground-secondary">menu</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="chart" label="Chart" />
        <span className="text-xs text-foreground-secondary">chart</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="plus" size="icon-xs" label="Extra small" />
        <span className="text-xs text-foreground-secondary">icon-xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="plus" size="icon-sm" label="Small" />
        <span className="text-xs text-foreground-secondary">icon-sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="plus" size="icon" label="Default" />
        <span className="text-xs text-foreground-secondary">icon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="plus" size="icon-lg" label="Large" />
        <span className="text-xs text-foreground-secondary">icon-lg</span>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="plus" variant="default" label="Default" />
        <span className="text-xs text-foreground-secondary">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="close" variant="destructive" label="Destructive" />
        <span className="text-xs text-foreground-secondary">destructive</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="edit" variant="outline" label="Outline" />
        <span className="text-xs text-foreground-secondary">outline</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="search" variant="secondary" label="Secondary" />
        <span className="text-xs text-foreground-secondary">secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="menu" variant="ghost" label="Ghost" />
        <span className="text-xs text-foreground-secondary">ghost</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton icon="check" variant="icon" label="Icon" />
        <span className="text-xs text-foreground-secondary">icon</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    icon: 'plus',
    label: 'Disabled button',
    isDisabled: true,
  },
};

