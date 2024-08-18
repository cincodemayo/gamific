import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Input';

const meta = {
  title: 'Input/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'Jane',
  },
};
