import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Lock, User } from 'lucide-react';

import { Input } from '@/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Visual style variant',
    },
    isDisabled: {
      control: 'boolean',
    },
    isInvalid: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Enter text...',
    size: 'default',
    variant: 'default',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text...',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// All Size Variants
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8 w-80">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Large</p>
        <Input size="xl" placeholder="Extra large input" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Large</p>
        <Input size="lg" placeholder="Large input" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
        <Input size="default" placeholder="Default input" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Small</p>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Small</p>
        <Input size="xs" placeholder="Extra small input" />
      </div>
    </div>
  ),
};

// All Style Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8 w-80">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
        <Input variant="default" placeholder="Default variant" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Outline</p>
        <Input variant="outline" placeholder="Outline variant" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithDescription: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    description: 'Must be at least 8 characters long',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    errorMessage: 'Please enter a valid email address',
    isInvalid: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithStartAdornment: Story = {
  args: {
    placeholder: 'Email address',
    startAdornment: <Mail className="h-5 w-5 text-foreground-secondary" />,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithEndAdornment: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    endAdornment: <Lock className="h-5 w-5 text-foreground-secondary" />,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithBothAdornments: Story = {
  args: {
    placeholder: 'Username',
    startAdornment: <User className="h-5 w-5 text-foreground-secondary" />,
    endAdornment: (
      <span className="text-xs text-foreground-secondary">@company.com</span>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// Adornments with different sizes
export const AdornmentsWithSizes: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Large with Icon</p>
        <Input 
          size="xl" 
          placeholder="Search..." 
          startAdornment={<Mail className="h-5 w-5 text-foreground-secondary" />}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Large with Icon</p>
        <Input 
          size="lg" 
          placeholder="Search..." 
          startAdornment={<Mail className="h-5 w-5 text-foreground-secondary" />}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default with Icon</p>
        <Input 
          size="default" 
          placeholder="Search..." 
          startAdornment={<Mail className="h-4 w-4 text-foreground-secondary" />}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Small with Icon</p>
        <Input 
          size="sm" 
          placeholder="Search..." 
          startAdornment={<Mail className="h-4 w-4 text-foreground-secondary" />}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Small with Icon</p>
        <Input 
          size="xs" 
          placeholder="Search..." 
          startAdornment={<Mail className="h-3 w-3 text-foreground-secondary" />}
        />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit this',
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

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default Variant</p>
        <Input placeholder="Default variant" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Outline Variant</p>
        <Input variant="outline" placeholder="Outline variant" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With Label</p>
        <Input label="With Label" placeholder="Enter text..." />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With Description</p>
        <Input 
          label="With Description" 
          placeholder="Enter text..." 
          description="This is a helpful description"
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With Error</p>
        <Input 
          label="With Error" 
          placeholder="Enter text..." 
          errorMessage="This field is required"
          isInvalid
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With Icon</p>
        <Input 
          placeholder="With icon" 
          startAdornment={<Mail className="h-4 w-4 text-foreground-secondary" />}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Disabled</p>
        <Input 
          placeholder="Disabled" 
          isDisabled
        />
      </div>
    </div>
  ),
};
