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
    isDisabled: {
      control: 'boolean',
    },
    isInvalid: {
      control: 'boolean',
    },
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
      <Input placeholder="Default input" />
      <Input label="With Label" placeholder="Enter text..." />
      <Input 
        label="With Description" 
        placeholder="Enter text..." 
        description="This is a helpful description"
      />
      <Input 
        label="With Error" 
        placeholder="Enter text..." 
        errorMessage="This field is required"
        isInvalid
      />
      <Input 
        placeholder="With icon" 
        startAdornment={<Mail className="h-5 w-5 text-foreground-secondary" />}
      />
      <Input 
        placeholder="Disabled" 
        isDisabled
      />
    </div>
  ),
};

