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
  versesCount?: number;
  revelationPlace?: string;
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
  translatedName,
  versesCount,
  revelationPlace,
}: Pick<
  SurahIntroDetails,
  'translatedName' | 'versesCount' | 'revelationPlace'
>): React.JSX.Element => (
  <div className="flex items-center justify-start pl-4 sm:pl-12">
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-2xl text-foreground sm:text-3xl"
        style={{
          fontFamily: "'UthmanicHafs1Ver18', serif",
          lineHeight: 1.4,
        }}
      >
        {revelationPlace === 'makkah' ? 'مكية' : 'مدنية'}
      </span>
      <div className="flex flex-col items-center gap-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
        <span>{translatedName}</span>
        <span>{versesCount} Verses</span>
      </div>
    </div>
  </div>
);

const SurahIntroBismillah = ({ showBismillah }: { showBismillah: boolean }): React.JSX.Element => (
  <div className="flex items-center justify-center">
    {showBismillah ? (
      <p
        dir="rtl"
        className="text-center text-2xl leading-none text-foreground sm:text-4xl"
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
    <div className="relative h-16 w-40 sm:h-20 sm:w-60">
      <SurahNameGraphic chapterId={chapterId} />
    </div>
  </div>
);

export const SurahCalligraphyIntro = ({
  chapterId,
}: {
  chapterId?: number | null;
}): React.JSX.Element | null => {
  const introDetails = useSurahIntroDetails(chapterId);

  if (!introDetails) return null;

  return (
    <div className="mx-auto mb-8 w-full max-w-7xl px-4 sm:px-6">
      <div className="grid w-full grid-cols-3 items-center border-y border-border/40 py-6">
        <SurahMetadata
          translatedName={introDetails.translatedName}
          versesCount={introDetails.versesCount}
          revelationPlace={introDetails.revelationPlace}
        />
        <SurahIntroBismillah showBismillah={introDetails.showBismillah} />
        <SurahTitleBlock chapterId={introDetails.chapterId} />
      </div>
    </div>
  );
};
