import type { Meta, StoryObj } from '@storybook/react';
import { Tick } from './Icons';

const meta = {
    title: 'Icons/Tick',
    component: Tick,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tick>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};