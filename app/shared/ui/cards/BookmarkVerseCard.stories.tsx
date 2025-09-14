import preview from '@/.storybook/preview';

import { BookmarkVerseCard } from './BookmarkVerseCard';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BookmarkVerseCard> = {
  title: 'Shared/UI/Cards/BookmarkVerseCard',
  component: BookmarkVerseCard,
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

const mockBookmark = {
  id: '1',
  verseKey: '1:1',
  surahName: 'Al-Fatihah',
  ayahNumber: 1,
  arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  translationText: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
  createdAt: new Date().toISOString(),
  tags: ['daily-read'],
  note: 'Opening verse of the Quran',
  folderId: 'pinned',
};

export const Default: Story = {
  args: {
    bookmark: mockBookmark,
    onEdit: () => {},
    onDelete: () => {},
    onTogglePin: () => {},
  },
};

export const WithoutNote: Story = {
  args: {
    bookmark: {
      ...mockBookmark,
      note: undefined,
    },
    onEdit: () => {},
    onDelete: () => {},
    onTogglePin: () => {},
  },
};

export const WithLongText: Story = {
  args: {
    bookmark: {
      ...mockBookmark,
      arabicText:
        'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
      translationText:
        'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
      note: 'This is the famous Ayat al-Kursi, one of the most important verses in the Quran that describes the majesty and power of Allah.',
    },
    onEdit: () => {},
    onDelete: () => {},
    onTogglePin: () => {},
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4">
      <BookmarkVerseCard
        bookmark={mockBookmark}
        onEdit={() => {}}
        onDelete={() => {}}
        onTogglePin={() => {}}
      />
      <BookmarkVerseCard
        bookmark={{
          ...mockBookmark,
          id: '2',
          verseKey: '2:255',
          surahName: 'Al-Baqarah',
          ayahNumber: 255,
          arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
          translationText: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer.',
          note: 'Ayat al-Kursi',
        }}
        onEdit={() => {}}
        onDelete={() => {}}
        onTogglePin={() => {}}
      />
    </div>
  ),
};
