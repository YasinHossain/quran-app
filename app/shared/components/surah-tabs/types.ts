import type { JuzSummary } from '@/app/shared/navigation/types';
import type { Chapter } from '@/types';

export type TabKey = 'Surah' | 'Juz' | 'Page';

export interface SurahTabsProps {
  chapters: ReadonlyArray<Chapter>;
  filteredChapters: ReadonlyArray<Chapter>;
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  searchInput: React.ReactNode;
}

// Re-export for local consumers to avoid deep import coupling
export type { JuzSummary };
