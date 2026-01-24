import { useMemo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import type { MushafFlags, MushafMainProps, ReaderSettings } from './MushafMain.types';

type MushafMainState = {
  settings: ReaderSettings;
  mushafFlags: MushafFlags;
  shouldRenderSurahIntro: boolean;
};

const useMushafFlags = (mushafId?: string): MushafFlags =>
  useMemo(() => {
    const isTajweedMushaf = mushafId === 'qcf-tajweed-v4';
    const isQcfMushaf =
      mushafId === 'qcf-madani-v1' || mushafId === 'qcf-madani-v2' || isTajweedMushaf;

    // Determine QCF version: v4 for Tajweed, v2 for Madani V2, v1 for everything else
    const qcfVersion = isTajweedMushaf ? 'v4' : mushafId === 'qcf-madani-v2' ? 'v2' : 'v1';

    return {
      isQcfMushaf,
      isQpcHafsMushaf: mushafId === 'qpc-uthmani-hafs',
      isIndopakMushaf: mushafId === 'unicode-indopak-15' || mushafId === 'unicode-indopak-16',
      isTajweedMushaf,
      qcfVersion,
      indopakVersion:
        mushafId === 'unicode-indopak-16' ? '16' : mushafId === 'unicode-indopak-15' ? '15' : null,
    };
  }, [mushafId]);

export const useMushafMainState = ({
  mushafName: _mushafName,
  mushafId,
  chapterId,
}: MushafMainProps): MushafMainState => {
  const { settings } = useSettings();
  const mushafFlags = useMushafFlags(mushafId);
  void _mushafName;

  return {
    settings,
    mushafFlags,
    shouldRenderSurahIntro: typeof chapterId === 'number' && chapterId > 0,
  };
};

export type { MushafMainState };
