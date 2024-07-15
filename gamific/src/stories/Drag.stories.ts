import type { Meta, StoryObj } from '@storybook/react';
import { Drag } from './Icons';

const meta = {
    title: 'Icons/Drag',
    component: Drag,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Drag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};