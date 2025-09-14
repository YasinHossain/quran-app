import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';

import type { Verse } from '@/types';

export interface UseVerseListingReturn {
  error: string | null;
  isLoading: boolean;
  verses: Verse[];
  isValidating: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
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
}

export type LookupFn = (options: LookupOptions) => Promise<{ verses: Verse[]; totalPages: number }>;

export interface UseVerseListingParams {
  /** Surah or resource ID */
  id?: string;
  /** Function to fetch verses */
  lookup: LookupFn;
  /** Optional initial verses for testing or SSR fallback */
  initialVerses?: Verse[];
}
