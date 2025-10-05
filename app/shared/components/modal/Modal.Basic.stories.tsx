import { fn } from '@storybook/test';

import { ModalActions } from './ModalActions';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';

import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';

const meta = {
  title: 'Shared/Modal/Basic',
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

export const Default: Story = {
  args: {
    title: 'Modal Title',
    description:
      'This is a basic modal with some content. It demonstrates the default styling and behavior.',
    children: (
      <ModalActions
        onCancel={fn()}
        onConfirm={fn()}
        cancelText="Cancel"
        confirmText="Confirm"
        confirmVariant="primary"
      />
    ),
  },
  render: (args): ReactElement => (
    <div className="relative">
      <ModalBackdrop onClick={fn()} />
      <ModalContent {...args} />
    </div>
  ),
};

export const Confirmation: Story = {
  args: {
    title: 'Delete Bookmark',
    description: 'Are you sure you want to delete this bookmark? This action cannot be undone.',
    children: (
      <ModalActions
        onCancel={fn()}
        onConfirm={fn()}
        cancelText="Cancel"
        confirmText="Delete"
        confirmVariant="error"
      />
    ),
  },
  render: (args): ReactElement => (
    <div className="relative">
      <ModalBackdrop onClick={fn()} />
      <ModalContent {...args} />
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    title: 'Terms and Conditions',
    description: 'Please review and accept the latest terms before continuing.',
    children: (
      <div className="space-y-6">
        <div className="max-h-64 overflow-y-auto space-y-3 text-content-secondary">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco...</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate...</p>
          <p>Excepteur sint occaecat cupidatat non proident...</p>
          <p>Sed ut perspiciatis unde omnis iste natus error...</p>
          <p>Totam rem aperiam, eaque ipsa quae ab illo inventore...</p>
        </div>
        <ModalActions
          onCancel={fn()}
          onConfirm={fn()}
          cancelText="Decline"
          confirmText="Accept"
          confirmVariant="primary"
        />
      </div>
    ),
  },
  render: (args): ReactElement => (
    <div className="relative">
      <ModalBackdrop onClick={fn()} />
      <ModalContent {...args} />
    </div>
  ),
};
