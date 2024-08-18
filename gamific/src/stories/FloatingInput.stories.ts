import type { Meta, StoryObj } from '@storybook/react';
import { FloatingInput } from './Input';

const meta = {
  title: 'FloatingInput',
  component: FloatingInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FloatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'Jane',
  },
};
