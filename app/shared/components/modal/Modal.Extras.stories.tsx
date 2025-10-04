import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps, JSX } from 'react';

import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';

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

const Frame = (args: ComponentProps<typeof ModalContent>): JSX.Element => (
  <div className="relative">
    <ModalBackdrop onClick={() => {}} />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ModalContent {...args} />
    </div>
  </div>
);

export const Mobile: Story = {
  render: (args): JSX.Element => <Frame {...args} />,
  args: {
    title: 'Quick actions',
    description: 'Manage recent activity and update your preferences without leaving the page.',
    children: (
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Use the controls below to personalize your reading experience. These preferences are saved across devices.
        </p>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Save changes</button>
      </div>
    ),
  },
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
  args: {
    title: 'Dark mode modal',
    description: 'All actions remain accessible with sufficient contrast in dark mode.',
    children: (
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Review these settings to ensure comfortable reading in low-light environments.
        </p>
        <button className="rounded-md border border-primary px-4 py-2 text-primary">Learn more</button>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { description: { story: 'Modal appearance in dark theme mode.' } },
  },
};
