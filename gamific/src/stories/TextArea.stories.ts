import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './Input';

const meta = {
  title: 'Input/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'Jane',
  },
};
