import type { Meta, StoryObj } from '@storybook/react';
import { Placeholder } from './Icons';

const meta = {
    title: 'Icons/Placeholder',
    component: Placeholder,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Placeholder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        size: '24',
        colour: 'none',
        fill: '#000000'
    }
};