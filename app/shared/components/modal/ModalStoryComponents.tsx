import { fn } from '@storybook/test';

import { ModalActions } from './ModalActions';
import { ModalBackdrop } from './ModalBackdrop';
import { ModalContent } from './ModalContent';

export const ModalStoryWrapper = (args: any) => (
  <div className="relative">
    <ModalBackdrop />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ModalContent {...args} />
    </div>
  </div>
);

export const DefaultModalBody = () => (
  <>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modal Title</h2>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      This is a basic modal with some content. It demonstrates the default styling and behavior.
    </p>
    <ModalActions
      primaryAction={{ label: 'Confirm', onClick: fn(), variant: 'primary' }}
      secondaryAction={{ label: 'Cancel', onClick: fn(), variant: 'secondary' }}
    />
  </>
);

export const ConfirmationModalBody = () => (
  <>
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mr-3">
        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Bookmark</h2>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Are you sure you want to delete this bookmark? This action cannot be undone.
    </p>
    <ModalActions
      primaryAction={{ label: 'Delete', onClick: fn(), variant: 'destructive' }}
      secondaryAction={{ label: 'Cancel', onClick: fn(), variant: 'secondary' }}
    />
  </>
);

export const LongContentModalBody = () => (
  <>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Terms and Conditions</h2>
    <div className="text-gray-600 dark:text-gray-300 mb-6 max-h-96 overflow-y-auto">
      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <p className="mb-4">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p className="mb-4">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <p className="mb-4">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="mb-4">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
      </p>
      <p className="mb-4">
        Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
    </div>
    <ModalActions
      primaryAction={{ label: 'Accept', onClick: fn(), variant: 'primary' }}
      secondaryAction={{ label: 'Decline', onClick: fn(), variant: 'secondary' }}
    />
  </>
);
