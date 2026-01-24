import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '@/lib/text/localizeNumbers';

import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { cn } from '@/lib/utils/cn';

type SurahIntroDetails = {
  revelationPlace?: string | undefined;
  showBismillah: boolean;
  chapterId: number;
  surahName: string;
  versesCount: number;
};

const useSurahIntroDetails = (chapterId?: number | null): SurahIntroDetails | null => {
  const { chapters } = useSurahNavigationData();

  if (!chapterId) return null;

  const chapter = chapters.find((item) => item.id === chapterId);
  const surahNumberLabel = chapter?.id ?? chapterId;
  const surahName = chapter?.name_simple ?? `Surah ${chapterId}`;
  const versesCount = chapter?.verses_count ?? 0;

  return {
    revelationPlace: chapter?.revelation_place,
    showBismillah: chapterId !== 9 && chapterId !== 1,
    chapterId: surahNumberLabel,
    surahName,
    versesCount,
  };
};

const SurahMetadata = ({
  revelationPlace,
}: Pick<SurahIntroDetails, 'revelationPlace'>): React.JSX.Element => (
  <div className="flex items-center justify-center">
    <span
      className="text-xl text-foreground sm:text-3xl"
      style={{
        fontFamily: "'UthmanicHafs1Ver18', serif",
        lineHeight: 1.4,
      }}
    >
      {revelationPlace === 'makkah' ? 'مكية' : 'مدنية'}
    </span>
  </div>
);

const SurahIntroBismillah = ({ showBismillah }: { showBismillah: boolean }): React.JSX.Element => (
  <div
    className={cn(
      'flex w-full items-center justify-center overflow-hidden transition-all duration-300',
      showBismillah ? 'h-auto opacity-100' : 'h-0 opacity-0'
    )}
  >
    <p
      dir="rtl"
      className="text-center text-3xl leading-none text-foreground sm:text-center sm:text-4xl"
      style={{
        fontFamily: "'UthmanicHafs1Ver18', serif",
      }}
    >
      ﷽
    </p>
  </div>
);

const SurahTitleBlock = ({
  surahName,
  versesLabel,
}: {
  surahName: string;
  versesLabel: string;
}): React.JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-1">
    <h1
      className="text-lg font-semibold text-foreground sm:text-xl"
      style={{
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}
    >
      {surahName}
    </h1>
    <span className="text-xs text-muted-foreground/50 sm:text-sm">{versesLabel}</span>
  </div>
);

export const SurahCalligraphyIntro = ({
  chapterId,
  className,
}: {
  chapterId?: number | null | undefined;
  className?: string;
}): React.JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const introDetails = useSurahIntroDetails(chapterId);

  if (!introDetails) return null;

  const translatedSurahName = t(`surah_names.${introDetails.chapterId}`, {
    defaultValue: introDetails.surahName,
  });

  const translatedVersesLabel = `${formatNumber(
    introDetails.versesCount,
    i18n.language
  )} ${t('verses')}`;

  return (
    <div className={cn('mx-auto mb-4 -mt-4 w-full max-w-7xl sm:-mt-3', className)}>
      <div className="flex w-full flex-col items-center gap-4 border-b border-border/40 pt-0 pb-5 sm:flex-row sm:justify-evenly sm:gap-0 sm:pt-6 sm:pb-9">
        <div className="order-3 sm:order-1 sm:min-w-[6rem] sm:w-auto">
          <SurahMetadata revelationPlace={introDetails.revelationPlace} />
        </div>

        <div className="order-2 w-full sm:order-2 sm:w-auto">
          <div className="flex flex-col items-center gap-3">
            <SurahIntroBismillah showBismillah={introDetails.showBismillah} />
          </div>
        </div>

        <div className="order-1 sm:order-3 sm:min-w-[6rem] sm:w-auto">
          <SurahTitleBlock
            surahName={translatedSurahName}
            versesLabel={translatedVersesLabel}
          />
        </div>
      </div>
    </div>
  );
};
