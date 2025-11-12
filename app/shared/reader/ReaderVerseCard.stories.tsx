import React, { useEffect, useRef } from 'react';

import preview from '@/.storybook/preview';
import { SettingsProvider, useSettings } from '@/app/providers/SettingsContext';
import { ReaderVerseCard } from '@/app/shared/reader/VerseCard';

import type { Settings, Verse } from '@/types';
import type { Meta, StoryObj } from '@storybook/react';

const storySettingsOverrides: Partial<Settings> = {
  showByWords: true,
  wordLang: 'en',
  translationFontSize: 18,
  arabicFontSize: 30,
  translationIds: [20, 21],
};

const SettingsInitializer = ({
  overrides,
  children,
}: {
  overrides: Partial<Settings>;
  children: React.ReactNode;
}): React.ReactElement => {
  const { settings, setSettings } = useSettings();
  const hasAppliedRef = useRef(false);

  useEffect(() => {
    if (hasAppliedRef.current) return;
    hasAppliedRef.current = true;
    setSettings({ ...settings, ...overrides });
  }, [overrides, setSettings, settings]);

  return <>{children}</>;
};

const withStorySettings = (Story: () => React.ReactNode): React.ReactNode => (
  <SettingsProvider>
    <SettingsInitializer overrides={storySettingsOverrides}>
      <Story />
    </SettingsInitializer>
  </SettingsProvider>
);

const ayatAlKursi: Verse = {
  id: 262,
  verse_key: '2:255',
  text_uthmani: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ',
  translations: [
    {
      resource_id: 20,
      text: '<strong>Allah</strong>—there is no deity except Him, the Ever-Living, the Sustainer of all that exists.',
    },
    {
      resource_id: 131,
      text: 'Dieu! Nulle divinité ne mérite d’être adorée si ce n’est Lui, le Vivant, l’Immuable.',
    },
  ],
  words: [
    { id: 1, uthmani: 'اللَّهُ', en: 'Allah' },
    { id: 2, uthmani: 'لَا', en: 'no' },
    { id: 3, uthmani: 'إِلَٰهَ', en: 'deity' },
    { id: 4, uthmani: 'إِلَّا', en: 'except' },
    { id: 5, uthmani: 'هُوَ', en: 'Him' },
    { id: 6, uthmani: 'الْحَيُّ', en: 'the Ever-Living' },
    { id: 7, uthmani: 'الْقَيُّومُ', en: 'the Sustainer' },
  ],
};

const verseOfLight: Verse = {
  id: 282,
  verse_key: '24:35',
  text_uthmani:
    'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ',
  translations: [
    {
      resource_id: 20,
      text: 'Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp.',
    },
    {
      resource_id: 131,
      text: 'Allah est la Lumière des cieux et de la terre. Sa lumière est comparable à une niche où se trouve une lampe.',
    },
  ],
  words: [
    { id: 1, uthmani: 'اللَّهُ', en: 'Allah' },
    { id: 2, uthmani: 'نُورُ', en: 'is the Light' },
    { id: 3, uthmani: 'السَّمَاوَاتِ', en: 'of the heavens' },
    { id: 4, uthmani: 'وَالْأَرْضِ', en: 'and the earth' },
  ],
};

const meta: Meta<typeof ReaderVerseCard> = {
  title: 'Shared/Reader/ReaderVerseCard',
  component: ReaderVerseCard,
  decorators: [...(Array.isArray(preview.decorators) ? preview.decorators : []), withStorySettings],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#f8f7f4' },
        { name: 'dark', value: '#10121c' },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReaderVerseCard>;

export const SingleVerse: Story = {
  args: {
    verse: ayatAlKursi,
    variant: 'contained',
  },
};

export const VerseList: Story = {
  render: () => (
    <div className="max-w-3xl mx-auto space-y-6 p-8">
      <ReaderVerseCard verse={ayatAlKursi} variant="separated" />
      <ReaderVerseCard verse={verseOfLight} variant="separated" />
    </div>
  ),
};
