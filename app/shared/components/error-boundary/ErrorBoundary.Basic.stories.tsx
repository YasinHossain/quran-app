import { fn } from '@storybook/test';

import type { JSX } from 'react';

import { DefaultErrorFallback } from './DefaultErrorFallback';
import { ErrorBoundary } from './ErrorBoundary';

import type { ErrorFallbackProps } from './ErrorBoundary';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/ErrorBoundary/Basic',
  component: ErrorBoundary,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Error boundary components for graceful error handling with contextual fallbacks.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }): JSX.Element => {
  if (shouldThrow) {
    throw new Error('This is a test error for the error boundary');
  }
  return (
    <div className="rounded-lg border border-status-success/20 bg-status-success/10 p-6">
      <h3 className="mb-2 text-lg font-semibold text-status-success">Component Working Fine</h3>
      <p className="text-status-success/80">
        This component is rendering successfully without any errors.
      </p>
    </div>
  );
};

export const Default: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={false} />,
  },
};

export const WithError: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary catches the error and displays the default fallback UI.',
      },
    },
  },
};

const CustomFallbackComponent = ({ error, resetError }: ErrorFallbackProps): JSX.Element => (
  <div className="rounded-lg border border-status-error/20 bg-status-error/10 p-8">
    <div className="flex items-center mb-4">
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-status-error/20">
        <svg className="h-4 w-4 text-status-error" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-status-error">Custom Error Handler</h3>
    </div>
    <p className="mb-4 text-status-error/80">
      This is a custom error fallback UI. Error: {error?.message}
    </p>
    <button
      onClick={resetError}
      className="rounded-lg bg-status-error px-4 py-2 text-on-accent transition-colors hover:bg-status-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Try Again
    </button>
  </div>
);

export const CustomFallback: Story = {
  args: {
    fallback: CustomFallbackComponent,
    children: <ErrorThrowingComponent shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary with a custom fallback UI component.',
      },
    },
  },
};

export const DefaultErrorFallbackStory: Story = {
  name: 'Default Error Fallback',
  args: {
    children: null,
  },
  render: () => (
    <DefaultErrorFallback
      error={new Error('Example error message for testing')}
      resetError={fn()}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default error fallback component used by error boundaries.',
      },
    },
  },
};
