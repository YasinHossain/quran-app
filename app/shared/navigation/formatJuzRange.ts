import type { TFunction } from 'i18next';

import { formatNumber } from '@/lib/text/localizeNumbers';

import type { JuzSummary } from '@/app/shared/navigation/types';

const formatAyahNumber = (ayah: number, language: string): string =>
  formatNumber(ayah, language, { useGrouping: false });

const formatSurahName = (surahId: number, t: TFunction, language: string): string => {
  const fallback = `${t('surah_tab')} ${formatNumber(surahId, language, { useGrouping: false })}`;
  return t(`surah_names.${surahId}`, fallback);
};

export const formatJuzRange = (juz: JuzSummary, t: TFunction, language: string): string => {
  const { startSurahId, startAyah, endSurahId, endAyah } = juz;

  if (
    typeof startSurahId !== 'number' ||
    typeof startAyah !== 'number' ||
    typeof endSurahId !== 'number' ||
    typeof endAyah !== 'number'
  ) {
    return juz.surahRange;
  }

  const startSurah = formatSurahName(startSurahId, t, language);
  const endSurah = formatSurahName(endSurahId, t, language);

  return `${startSurah} ${formatAyahNumber(startAyah, language)} - ${endSurah} ${formatAyahNumber(endAyah, language)}`;
};
