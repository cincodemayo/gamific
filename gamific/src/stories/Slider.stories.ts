import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Input';

const meta = {
  title: 'Input/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'Jane',
    value: 1000,
    min: 100,
    max: 5000
  },
};
