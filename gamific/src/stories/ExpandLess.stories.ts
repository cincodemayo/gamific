import type { Meta, StoryObj } from '@storybook/react';
import { ExpandLess } from './Icons';

const meta = {
    title: 'Icons/ExpandLess',
    component: ExpandLess,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ExpandLess>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: '#000000',
        fill: 'none'
    }
};