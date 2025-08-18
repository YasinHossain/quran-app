import type { Meta, StoryObj } from '@storybook/react';
import { SurahCard } from './SurahCard';
import type { Surah } from '@/types';

const meta: Meta<typeof SurahCard> = {
  title: 'Components/SurahCard',
  component: SurahCard,
};

export default meta;

type Story = StoryObj<typeof SurahCard>;

const sampleSurah: Surah = {
  number: 1,
  name: 'Al-Fatihah',
  meaning: 'The Opening',
  arabicName: 'الفاتحة',
  verses: 7,
};

export const Default: Story = {
  args: {
    surah: sampleSurah,
  },
};
