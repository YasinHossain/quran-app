import { ResponsiveBackgroundImage } from './ResponsiveBackgroundImage';
import { ResponsiveImage } from './ResponsiveImage';

import type { Meta, StoryObj } from '@storybook/react';

const COVER_IMAGE_SRC =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/800px-Quran_cover.jpg';
const COVER_IMAGE_ALT = 'Quran book cover';

const meta = {
  title: 'Shared/ResponsiveImage/Extras',
  component: ResponsiveImage,
  parameters: { layout: 'centered' },
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

export const FillMode: Story = {
  args: {
    src: COVER_IMAGE_SRC,
    alt: COVER_IMAGE_ALT,
    fill: true,
    style: { objectFit: 'cover' },
  },
  render: (args) => (
    <div className="relative h-96 w-full overflow-hidden rounded-lg bg-surface">
      <ResponsiveImage {...args} />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    src: 'https://invalid-url/nonexistent-image.jpg',
    alt: 'Failed to load image',
    width: 400,
    height: 600,
    className: 'rounded-lg shadow-lg',
  },
};

export const BackgroundImage: Story = {
  args: {
    src: COVER_IMAGE_SRC,
    className: 'h-96 rounded-lg flex items-center justify-center',
  },
  render: (args) => (
    <ResponsiveBackgroundImage src={args.src ?? COVER_IMAGE_SRC} className={args.className}>
      <div className="rounded-lg bg-surface/90 p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Overlay Content</h2>
        <p className="text-content-secondary">Content displayed over background image</p>
      </div>
    </ResponsiveBackgroundImage>
  ),
};

export const Gallery: Story = {
  args: {
    width: 400,
    height: 300,
    className: 'rounded-lg shadow-md object-cover w-full h-full',
    loading: 'lazy',
  },
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="aspect-w-4 aspect-h-3">
          <ResponsiveImage
            {...args}
            src={`https://picsum.photos/400/300?random=${index}`}
            alt={`Gallery image ${index}`}
          />
        </div>
      ))}
    </div>
  ),
};

export const Mobile: Story = {
  args: {
    src: COVER_IMAGE_SRC,
    alt: COVER_IMAGE_ALT,
    width: 800,
    height: 600,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto p-8">
      <ResponsiveImage {...args} />
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const DarkTheme: Story = {
  args: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Quran_cover.jpg/400px-Quran_cover.jpg',
    alt: COVER_IMAGE_ALT,
    width: 400,
    height: 600,
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto p-8 dark">
      <ResponsiveImage {...args} />
    </div>
  ),
  parameters: { backgrounds: { default: 'dark' } },
};
