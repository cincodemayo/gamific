import type { Meta, StoryObj } from '@storybook/react';
import { Star } from './Icons';

const meta = {
    title: 'Icons/Star',
    component: Star,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Star>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};