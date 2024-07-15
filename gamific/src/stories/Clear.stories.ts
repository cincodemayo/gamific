import type { Meta, StoryObj } from '@storybook/react';
import { Clear } from './Icons';

const meta = {
    title: 'Icons/Clear',
    component: Clear,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Clear>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};