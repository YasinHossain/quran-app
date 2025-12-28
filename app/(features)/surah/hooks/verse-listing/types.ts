import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import type { Verse } from '@/types';
import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';

export type VerseListingMode = 'infinite' | 'quran-com';

export interface UseVerseListingReturn {
  mode: VerseListingMode;
  error: string | null;
  setError: (message: string) => void;
  isLoading: boolean;
  verses: Verse[];
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  totalVerses?: number | undefined;
  perPage: number;
  apiPageToVersesMap: Record<number, Verse[]>;
  setApiPageToVersesMap: React.Dispatch<React.SetStateAction<Record<number, Verse[]>>>;
  lookup: LookupFn;
  resourceId?: string | undefined;
  translationIds: number[];
  wordLang: string;
  initialVerses?: Verse[] | undefined;
  translationOptions: { id: number; name: string; lang: string }[];
  wordLanguageOptions: { name: string; id: number }[];
  wordLanguageMap: Record<string, number>;
  settings: ReturnType<typeof useSettings>['settings'];
  setSettings: ReturnType<typeof useSettings>['setSettings'];
  activeVerse: ReturnType<typeof useAudio>['activeVerse'];
  reciter: ReturnType<typeof useAudio>['reciter'];
  isPlayerVisible: ReturnType<typeof useAudio>['isPlayerVisible'];
  handleNext: () => boolean;
  handlePrev: () => boolean;
}

export interface LookupOptions {
  id: string;
  translationIds: number | number[];
  page: number;
  perPage: number;
  wordLang: string;
  /** When true, fetches code_v2 and page_number fields for Tajweed V4 font rendering */
  tajweed?: boolean;
}

export type LookupFn = (options: LookupOptions) => Promise<{ verses: Verse[]; totalPages: number }>;

export interface UseVerseListingParams {
  /** Surah or resource ID */
  id?: string;
  /** Resource kind (surah, juz, page) */
  resourceKind?: MushafResourceKind;
  /** Total verse count when known (surah-only, for stable virtualization) */
  totalVerses?: number | undefined;
  /** Function to fetch verses */
  lookup: LookupFn;
  /** Optional initial verses for testing or SSR fallback */
  initialVerses?: Verse[];
  /** Metadata describing how initialVerses were fetched (SSR only). */
  initialVersesParams?: { translationIds: number[]; wordLang: string } | undefined;
  /** Verse number (within the surah) to prefetch/scroll to */
  initialVerseNumber?: number | undefined;
}
