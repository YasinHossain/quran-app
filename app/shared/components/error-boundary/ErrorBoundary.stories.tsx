import { fn } from '@storybook/test';
import { DefaultErrorFallback } from './DefaultErrorFallback';
import { ErrorBoundary } from './ErrorBoundary';
import { FeatureErrorBoundary } from './FeatureErrorBoundary';
import {
  ErrorThrowingComponent,
  customFallback,
  NestedBoundariesContent,
} from './ErrorBoundaryStoryComponents';



const meta = {
  title: 'Shared/ErrorBoundary',
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const CustomFallback: Story = {
  args: {
    fallback: customFallback,
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
  parameters: {
    docs: {
      description: {
        story: 'Feature-specific error boundary with contextual messaging.',
      },
    },
  },
};

export const NestedErrorBoundaries: Story = {
  render: () => <NestedBoundariesContent />,
  parameters: {
    docs: {
      description: {
        story: 'Multiple error boundaries isolating errors to specific sections.',
      },
    },
  },
};

export const Mobile: Story = {
  ...WithError,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Error boundary behavior on mobile devices.',
      },
    },
  },
};

export const DarkTheme: Story = {
  ...WithError,
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Error boundary appearance in dark theme mode.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-8 dark">
        <Story />
      </div>
    ),
  ],
};
