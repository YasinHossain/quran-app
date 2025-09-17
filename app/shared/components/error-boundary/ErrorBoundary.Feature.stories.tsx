import { ErrorBoundary } from './ErrorBoundary';
import { FeatureErrorBoundary } from './FeatureErrorBoundary';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/ErrorBoundary/Feature',
  component: ErrorBoundary,
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
      <p className="text-status-success/80">This component is rendering successfully.</p>
    </div>
  );
};

export const FeatureErrorBoundaryStory: Story = {
  name: 'Feature Error Boundary',
  render: () => (
    <FeatureErrorBoundary
      featureName="Audio Player"
      description="There was an issue with the audio player. You can still read the Quran text."
    >
      <ErrorThrowingComponent shouldThrow={true} />
    </FeatureErrorBoundary>
  ),
};

export const NestedErrorBoundaries: Story = {
  render: () => (
    <div className="space-y-6">
      <ErrorBoundary>
        <div className="rounded-lg border border-status-info/20 bg-status-info/10 p-4">
          <h4 className="mb-2 font-semibold text-status-info">Section 1</h4>
          <ErrorThrowingComponent shouldThrow={false} />
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="rounded-lg border border-accent/20 bg-accent/10 p-4">
          <h4 className="mb-2 font-semibold text-accent">Section 2 (Error)</h4>
          <ErrorThrowingComponent shouldThrow={true} />
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="rounded-lg border border-status-success/20 bg-status-success/10 p-4">
          <h4 className="mb-2 font-semibold text-status-success">Section 3</h4>
          <ErrorThrowingComponent shouldThrow={false} />
        </div>
      </ErrorBoundary>
    </div>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="min-h-screen">
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const DarkTheme: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 dark">
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
