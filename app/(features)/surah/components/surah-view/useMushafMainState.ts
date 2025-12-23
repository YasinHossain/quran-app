import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/app/providers/SettingsContext';

import type { MushafFlags, MushafMainProps, ReaderSettings } from './MushafMain.types';

type MushafMainState = {
  settings: ReaderSettings;
  mushafFlags: MushafFlags;
  shouldRenderSurahIntro: boolean;
  endLabel: string;
};

const useMushafFlags = (mushafId?: string): MushafFlags =>
  useMemo(
    () => ({
      isQcfMushaf: mushafId === 'qcf-madani-v1' || mushafId === 'qcf-madani-v2',
      isQpcHafsMushaf: mushafId === 'qpc-uthmani-hafs',
      isIndopakMushaf: mushafId === 'unicode-indopak-15' || mushafId === 'unicode-indopak-16',
      qcfVersion: mushafId === 'qcf-madani-v2' ? 'v2' : 'v1',
      indopakVersion:
        mushafId === 'unicode-indopak-16' ? '16' : mushafId === 'unicode-indopak-15' ? '15' : null,
    }),
    [mushafId]
  );

export const useMushafMainState = ({
  mushafName: _mushafName,
  mushafId,
  chapterId,
  endLabelKey = 'end_of_surah',
}: MushafMainProps): MushafMainState => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const mushafFlags = useMushafFlags(mushafId);
  void _mushafName;

  return {
    settings,
    mushafFlags,
    shouldRenderSurahIntro: typeof chapterId === 'number' && chapterId > 0,
    endLabel: t(endLabelKey),
  };
};

export type { MushafMainState };
