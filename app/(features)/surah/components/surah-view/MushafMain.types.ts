import type { useSettings } from '@/app/providers/SettingsContext';
import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';

export interface MushafMainProps {
  mushafName: string;
  mushafId?: string | undefined;
  resourceId: string;
  resourceKind: MushafResourceKind;
  initialPageNumber?: number | undefined;
  initialVerseKey?: string | undefined;
  chapterId?: number | null | undefined;
  juzNumber?: number | null | undefined;
  reciterId?: number | undefined;
  wordByWordLocale?: string | undefined;
  translationIds?: string | undefined;
  endLabelKey?: string | undefined;
}

export type ReaderSettings = Pick<
  ReturnType<typeof useSettings>['settings'],
  'tajweed' | 'arabicFontFace' | 'arabicFontSize'
>;

export type MushafFlags = {
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: 'v1' | 'v2';
  indopakVersion?: '15' | '16' | null;
};
