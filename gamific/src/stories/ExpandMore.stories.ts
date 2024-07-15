import type { Meta, StoryObj } from '@storybook/react';
import { ExpandMore } from './Icons';

const meta = {
    title: 'Icons/ExpandMore',
    component: ExpandMore,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ExpandMore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};