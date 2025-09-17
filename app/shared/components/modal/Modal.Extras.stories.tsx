import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/Modal/Extras',
  component: ModalContent,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModalContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = (args: React.ComponentProps<typeof ModalContent>): JSX.Element => (
  <div className="relative">
    <ModalBackdrop />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ModalContent {...args} />
    </div>
  </div>
);

export const Mobile: Story = {
  render: (args): JSX.Element => <Frame {...args} />,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: { description: { story: 'Modal behavior on mobile devices.' } },
  },
};

export const DarkTheme: Story = {
  render: (args): JSX.Element => (
    <div className="min-h-screen bg-background p-8 dark">
      <Frame {...args} />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { description: { story: 'Modal appearance in dark theme mode.' } },
  },
};
