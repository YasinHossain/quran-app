import { ResponsiveImage } from './ResponsiveImage';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/ResponsiveImage/Basic',
  component: ResponsiveImage,
  parameters: {
    layout: 'centered',
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
};
