import type { Meta, StoryObj } from '@storybook/react';
import preview from '../../../.storybook/preview';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  decorators: [...(preview.decorators || [])],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};
