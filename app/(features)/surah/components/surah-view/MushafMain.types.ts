import type { useSettings } from '@/app/providers/SettingsContext';
import type { MushafPageLines } from '@/types';

export interface MushafMainProps {
  mushafName: string;
  mushafId?: string | undefined;
  pages: MushafPageLines[];
  chapterId?: number | null | undefined;
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  error: string | null;
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
