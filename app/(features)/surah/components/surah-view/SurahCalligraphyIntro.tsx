import React from 'react';

import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { cn } from '@/lib/utils/cn';

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
              '<svg preserveAspectRatio="xMidYMid meet"'
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

  return (
    <div
      className={cn(
        'h-full w-full flex items-center justify-center transition-opacity duration-300 [&>svg]:h-full [&>svg]:w-full [&_path]:fill-foreground [&_path]:stroke-[hsl(var(--background))] [&_path]:stroke-[8]',
        svgContent ? 'opacity-100' : 'opacity-0'
      )}
      dangerouslySetInnerHTML={{ __html: svgContent || '' }}
    />
  );
};
type SurahIntroDetails = {
  revelationPlace?: string | undefined;
  showBismillah: boolean;
  chapterId: number;
};
type SurahNavChapter = ReturnType<typeof useSurahNavigationData>['chapters'][number];

const useSurahIntroDetails = (chapterId?: number | null): SurahIntroDetails | null => {
  const { chapters } = useSurahNavigationData();

  if (!chapterId) return null;

  const chapter = chapters.find((item) => item.id === chapterId);
  const surahNumberLabel = chapter?.id ?? chapterId;

  return {
    revelationPlace: chapter?.revelation_place,
    showBismillah: chapterId !== 9 && chapterId !== 1,
    chapterId: surahNumberLabel,
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

const SurahTitleBlock = ({ chapterId }: { chapterId: number }): React.JSX.Element => (
  <div className="flex items-center justify-center">
    <div className="relative h-14 w-36 sm:h-24 sm:w-full sm:max-w-[20rem]">
      <SurahNameGraphic chapterId={chapterId} />
    </div>
  </div>
);

export const SurahCalligraphyIntro = ({
  chapterId,
  className,
}: {
  chapterId?: number | null | undefined;
  className?: string;
}): React.JSX.Element | null => {
  const introDetails = useSurahIntroDetails(chapterId);

  if (!introDetails) return null;

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
          <SurahTitleBlock chapterId={introDetails.chapterId} />
        </div>
      </div>
    </div>
  );
};
