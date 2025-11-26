import React from 'react';

import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';

const SurahNameGraphic = ({ chapterId }: { chapterId: number }): React.JSX.Element | null => {
  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch(`/surah-names/${chapterId}.svg`)
      .then((res) => res.text())
      .then((text) => {
        if (mounted) {
          const svgMatch = text.match(/<svg[\s\S]*<\/svg>/);
          if (svgMatch) {
            const svgWithPreserve = svgMatch[0].replace(
              '<svg',
              '<svg preserveAspectRatio="xMidYMid slice"'
            );
            setSvgContent(svgWithPreserve);
          } else {
            setSvgContent(text);
          }
        }
      })
      .catch((err) => console.error('Failed to load Surah SVG:', err));

    return () => {
      mounted = false;
    };
  }, [chapterId]);

  if (!svgContent) return null;

  return (
    <div
      className="h-full w-full overflow-hidden [&>svg]:h-full [&>svg]:w-full [&_path]:fill-foreground [&_path]:stroke-[hsl(var(--background))] [&_path]:stroke-[8]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
type SurahIntroDetails = {
  translatedName: string;
  versesCount?: number | undefined;
  revelationPlace?: string | undefined;
  showBismillah: boolean;
  chapterId: number;
};
type SurahNavChapter = ReturnType<typeof useSurahNavigationData>['chapters'][number];

const getTranslatedSurahName = (
  chapter: SurahNavChapter | undefined,
  fallbackChapterId: number
): string => {
  if (chapter?.translated_name?.name) return chapter.translated_name.name;
  if (chapter?.name_simple) return chapter.name_simple;
  return `Surah ${fallbackChapterId}`;
};

const useSurahIntroDetails = (chapterId?: number | null): SurahIntroDetails | null => {
  const { chapters } = useSurahNavigationData();

  if (!chapterId) return null;

  const chapter = chapters.find((item) => item.id === chapterId);
  const surahNumberLabel = chapter?.id ?? chapterId;

  return {
    translatedName: getTranslatedSurahName(chapter, surahNumberLabel),
    versesCount: chapter?.verses_count,
    revelationPlace: chapter?.revelation_place,
    showBismillah: chapterId !== 9,
    chapterId: surahNumberLabel,
  };
};

const SurahMetadata = ({
  revelationPlace,
}: Pick<SurahIntroDetails, 'revelationPlace'>): React.JSX.Element => (
  <div className="flex items-center justify-start pl-2 sm:pl-12">
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
  <div className="flex w-full items-center justify-end sm:justify-center">
    {showBismillah ? (
      <p
        dir="rtl"
        className="text-right text-xl leading-none text-foreground sm:text-center sm:text-4xl"
        style={{
          fontFamily: "'UthmanicHafs1Ver18', serif",
        }}
      >
        ﷽
      </p>
    ) : null}
  </div>
);

const SurahTitleBlock = ({ chapterId }: { chapterId: number }): React.JSX.Element => (
  <div className="flex items-center justify-end">
    <div className="relative h-12 w-28 sm:h-20 sm:w-60">
      <SurahNameGraphic chapterId={chapterId} />
    </div>
  </div>
);

export const SurahCalligraphyIntro = ({
  chapterId,
}: {
  chapterId?: number | null | undefined;
}): React.JSX.Element | null => {
  const introDetails = useSurahIntroDetails(chapterId);

  if (!introDetails) return null;

  return (
    <div className="mx-auto mb-8 -mt-2 w-full max-w-7xl px-4 sm:-mt-3 sm:px-6">
      <div className="flex w-full flex-wrap items-center justify-between border-b border-border/40 pt-5 pb-8 sm:grid sm:grid-cols-3 sm:pt-6 sm:pb-9">
        <div className="order-1 sm:order-none sm:col-span-1">
          <SurahMetadata revelationPlace={introDetails.revelationPlace} />
        </div>

        <div className="order-3 mt-2 w-full sm:order-none sm:col-span-1 sm:mt-0 sm:w-auto">
          <SurahIntroBismillah showBismillah={introDetails.showBismillah} />
        </div>

        <div className="order-2 sm:order-none sm:col-span-1">
          <SurahTitleBlock chapterId={introDetails.chapterId} />
        </div>
      </div>
    </div>
  );
};
