import { fn } from '@storybook/test';

import { ModalActions } from './ModalActions';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';

import type { Meta, StoryObj } from '@storybook/react';

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
    children: (
      <>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Modal Title</h2>
        <p className="mb-6 text-content-secondary">
          This is a basic modal with some content. It demonstrates the default styling and behavior.
        </p>
        <ModalActions
          primaryAction={{ label: 'Confirm', onClick: fn(), variant: 'primary' }}
          secondaryAction={{ label: 'Cancel', onClick: fn(), variant: 'secondary' }}
        />
      </>
    ),
  },
  render: (args) => (
    <div className="relative">
      <ModalBackdrop />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <ModalContent {...args} />
      </div>
    </div>
  ),
};

export const Confirmation: Story = {
  args: {
    children: (
      <>
        <div className="flex items-center mb-4">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-status-warning/20">
            <svg className="h-4 w-4 text-status-warning" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Delete Bookmark</h2>
        </div>
        <p className="mb-6 text-content-secondary">
          Are you sure you want to delete this bookmark? This action cannot be undone.
        </p>
        <ModalActions
          primaryAction={{ label: 'Delete', onClick: fn(), variant: 'destructive' }}
          secondaryAction={{ label: 'Cancel', onClick: fn(), variant: 'secondary' }}
        />
      </>
    ),
  },
  render: Default.render,
};

export const LongContent: Story = {
  args: {
    children: (
      <>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Terms and Conditions</h2>
        <div className="mb-6 max-h-96 overflow-y-auto text-content-secondary">
          <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          <p className="mb-4">Ut enim ad minim veniam, quis nostrud exercitation ullamco...</p>
          <p className="mb-4">Duis aute irure dolor in reprehenderit in voluptate...</p>
          <p className="mb-4">Excepteur sint occaecat cupidatat non proident...</p>
          <p className="mb-4">Sed ut perspiciatis unde omnis iste natus error...</p>
          <p className="mb-4">Totam rem aperiam, eaque ipsa quae ab illo inventore...</p>
        </div>
        <ModalActions
          primaryAction={{ label: 'Accept', onClick: fn(), variant: 'primary' }}
          secondaryAction={{ label: 'Decline', onClick: fn(), variant: 'secondary' }}
        />
      </>
    ),
  },
  render: Default.render,
};
