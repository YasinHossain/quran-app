import preview from '@/.storybook/preview';

import { StandardNavigationCard } from './StandardNavigationCard';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof StandardNavigationCard> = {
  title: 'Shared/UI/Cards/StandardNavigationCard',
  component: StandardNavigationCard,
  decorators: [...(preview.decorators || [])],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    chromatic: {
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Al-Fatihah',
    subtitle: 'The Opening',
    href: '/surah/1',
    icon: '📖',
  },
};

export const WithLongText: Story = {
  args: {
    title: 'Al-Baqarah',
    subtitle: 'The Cow - This is a longer subtitle to test text wrapping',
    href: '/surah/2',
    icon: '🐄',
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'An-Nas',
    subtitle: 'Mankind',
    href: '/surah/114',
  },
};

// Visual regression test for different states
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <StandardNavigationCard title="Al-Fatihah" subtitle="The Opening" href="/surah/1" icon="📖" />
      <StandardNavigationCard
        title="Al-Baqarah"
        subtitle="The Cow - Long subtitle text"
        href="/surah/2"
        icon="🐄"
      />
      <StandardNavigationCard title="An-Nas" subtitle="Mankind" href="/surah/114" />
    </div>
  ),
};
