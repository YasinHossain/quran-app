import type { MushafPageLines, MushafVerse } from '@/types';

export type MushafResourceKind = 'surah' | 'juz' | 'page';

export interface UseMushafReadingViewParams {
  resourceId: string;
  resourceKind: MushafResourceKind;
  mushafId?: string | undefined;
  initialPageNumber?: number;
  chapterId?: number | null;
  juzNumber?: number | null;
  initialData?: MushafVerse[];
  reciterId?: number;
  wordByWordLocale?: string;
  translationIds?: string;
}

export interface UseMushafReadingViewResult {
  pages: MushafPageLines[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
}
