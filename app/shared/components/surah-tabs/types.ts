import type { Chapter } from '@/types';

export type TabKey = 'Surah' | 'Juz' | 'Page';

export interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

export interface SurahTabsProps {
  chapters: Chapter[];
  filteredChapters: Chapter[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  searchInput: React.ReactNode;
}
