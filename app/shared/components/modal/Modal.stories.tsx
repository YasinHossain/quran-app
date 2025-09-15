import { ModalContent } from './ModalContent';
import {
  ModalStoryWrapper,
  DefaultModalBody,
  ConfirmationModalBody,
  LongContentModalBody,
} from './ModalStoryComponents';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/Modal',
  component: ModalContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Flexible modal system with backdrop, content, and actions. Supports responsive behavior and accessibility.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModalContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <DefaultModalBody /> },
  render: (args) => <ModalStoryWrapper {...args} />,
};

export const Confirmation: Story = {
  args: { children: <ConfirmationModalBody /> },
  render: (args) => <ModalStoryWrapper {...args} />,
};

export const LongContent: Story = {
  args: { children: <LongContentModalBody /> },
  render: (args) => <ModalStoryWrapper {...args} />,
};

export const Mobile: Story = {
  ...Default,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: { description: { story: 'Modal behavior on mobile devices with proper responsive adjustments.' } },
  },
};

export const DarkTheme: Story = {
  ...Default,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { description: { story: 'Modal appearance in dark theme mode.' } },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-8 dark">
        <Story />
      </div>
    ),
  ],
};
