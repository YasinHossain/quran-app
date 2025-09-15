import { ResponsiveImage } from './ResponsiveImage';
import {
  FillModeExample,
  BackgroundImageExample,
  GalleryExample,
} from './ResponsiveImageStoryComponents';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/ResponsiveImage',
  component: ResponsiveImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Responsive image components with lazy loading, multiple sources, and performance optimizations.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResponsiveImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/400px-Quran_cover.jpg',
    alt: 'Quran book cover',
    width: 400,
    height: 600,
    className: 'rounded-lg shadow-lg',
  },
};

export const WithPlaceholder: Story = {
  args: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/400px-Quran_cover.jpg',
    alt: 'Quran book cover',
    width: 400,
    height: 600,
    placeholder: 'blur',
    className: 'rounded-lg shadow-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive image with blur placeholder while loading.',
      },
    },
  },
};

export const ResponsiveSizes: Story = {
  args: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/800px-Quran_cover.jpg',
    alt: 'Quran book cover',
    width: 800,
    height: 600,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    className: 'rounded-lg shadow-lg',
  },
  parameters: {
    docs: {
      description: { story: 'Image with responsive sizes for different screen widths.' },
    },
  },
};

export const Priority: Story = {
  args: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/400px-Quran_cover.jpg',
    alt: 'Quran book cover',
    width: 400,
    height: 600,
    priority: true,
    className: 'rounded-lg shadow-lg',
  },
  parameters: {
    docs: { description: { story: 'Image with priority loading for above-the-fold content.' } },
  },
};

export const FillMode: Story = {
  render: (args) => <FillModeExample {...args} />,
  parameters: {
    docs: { description: { story: 'Image using fill mode to cover its container.' } },
  },
};

export const ErrorState: Story = {
  args: {
    src: 'https://invalid-url/nonexistent-image.jpg',
    alt: 'Failed to load image',
    width: 400,
    height: 600,
    className: 'rounded-lg shadow-lg',
  },
  parameters: {
    docs: { description: { story: 'Image with error handling for failed loads.' } },
  },
};

export const BackgroundImage: Story = {
  render: () => <BackgroundImageExample />,
  parameters: {
    docs: { description: { story: 'Background image component with overlay content.' } },
  },
};

export const Gallery: Story = {
  render: () => <GalleryExample />,
  parameters: {
    docs: { description: { story: 'Gallery of images with lazy loading.' } },
  },
};

export const Mobile: Story = {
  ...ResponsiveSizes,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: { description: { story: 'Responsive image behavior on mobile devices.' } },
  },
};

export const DarkTheme: Story = {
  ...Default,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { description: { story: 'Responsive image in dark theme mode.' } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-8 dark">
        <Story />
      </div>
    ),
  ],
};
