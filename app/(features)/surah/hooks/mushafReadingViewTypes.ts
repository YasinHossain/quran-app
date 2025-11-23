import type { MushafPageLines, MushafVerse } from '@/types';

export type MushafResourceKind = 'surah' | 'juz' | 'page';

export interface UseMushafReadingViewParams {
  resourceId: string;
  resourceKind: MushafResourceKind;
  mushafId?: string | undefined;
  initialPageNumber?: number | undefined;
  chapterId?: number | null | undefined;
  juzNumber?: number | null | undefined;
  initialData?: MushafVerse[];
  reciterId?: number | undefined;
  wordByWordLocale?: string | undefined;
  translationIds?: string | undefined;
}

export interface UseMushafReadingViewResult {
  pages: MushafPageLines[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
}
