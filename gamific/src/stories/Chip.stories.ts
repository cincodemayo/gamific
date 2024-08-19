import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Misc';

const meta = {
  title: 'Misc/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    textColor: 'text-blue-100',
    backgroundColor: 'bg-gray-700',
    label: 'Jane'
  }
};
