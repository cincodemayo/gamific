import type { Meta, StoryObj } from '@storybook/react';
import { Cross } from './Icons';

const meta = {
    title: 'Icons/Cross',
    component: Cross,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Cross>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};