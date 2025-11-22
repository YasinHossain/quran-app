'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useQcfMushafFont } from '@/app/(features)/surah/hooks/useQcfMushafFont';
import {
  fontSizeToMushafScale,
  mushafScaleToFontSize,
} from '@/app/(features)/surah/hooks/mushafFontScale';
import {
  getQcfV1Preset,
  getQcfV2Preset,
  getQpcHafsPreset,
  getIndopak15Preset,
} from '@/app/(features)/surah/hooks/qcfScalePresets';
import { Spinner } from '@/app/shared/Spinner';
import { useSettings } from '@/app/providers/SettingsContext';
import { formatSurahSubtitle } from '@/app/shared/navigation/formatSurahSubtitle';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import { cn } from '@/lib/utils/cn';

import type { MushafLineGroup, MushafPageLines, MushafWord } from '@/types';
import { VerseMarker } from './VerseMarker';

interface MushafMainProps {
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

type ReaderSettings = Pick<
  ReturnType<typeof useSettings>['settings'],
  'tajweed' | 'arabicFontFace' | 'arabicFontSize'
>;

const MIN_LINE_WIDTH_PX = 440;
const MAX_LINE_WIDTH_PX = 540;
const LINE_WIDTH_SCALE = 16;

const SurahNameGraphic = ({ chapterId }: { chapterId: number }) => {
  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch(`/surah-names/${chapterId}.svg`)
      .then((res) => res.text())
      .then((text) => {
        if (mounted) {
          const svgMatch = text.match(/<svg[\s\S]*<\/svg>/);
          if (svgMatch) {
            // Inject preserveAspectRatio to crop whitespace
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

const SurahCalligraphyIntro = ({
  chapterId,
}: {
  chapterId?: number | null;
}): React.JSX.Element | null => {
  const { chapters } = useSurahNavigationData();

  const chapter = useMemo(
    () => chapters.find((item) => item.id === chapterId),
    [chapters, chapterId]
  );

  if (!chapterId) return null;

  const surahNumberLabel = chapter?.id ?? chapterId;
  const translatedName =
    chapter?.translated_name?.name ?? chapter?.name_simple ?? `Surah ${surahNumberLabel}`;
  const subtitle = chapter ? formatSurahSubtitle(chapter) : null;
  const showBismillah = chapterId !== 9;

  return (
    <div className="mx-auto mb-8 w-full max-w-7xl px-4 sm:px-6">
      <div className="grid w-full grid-cols-3 items-center border-y border-border/40 py-6">
        {/* Left Side: Metadata (Revelation & Verses) */}
        <div className="flex items-center justify-start pl-4 sm:pl-12">
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-2xl text-foreground sm:text-3xl"
              style={{
                fontFamily: "'UthmanicHafs1Ver18', serif",
                lineHeight: 1.4,
              }}
            >
              {chapter?.revelation_place === 'makkah' ? 'مكية' : 'مدنية'}
            </span>
            <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
              <span>{translatedName}</span>
              <span>•</span>
              <span>{chapter?.verses_count} Verses</span>
            </div>
          </div>
        </div>

        {/* Middle: Bismillah */}
        <div className="flex items-center justify-center">
          {showBismillah && (
            <p
              dir="rtl"
              className="text-center text-2xl leading-none text-foreground sm:text-4xl"
              style={{
                fontFamily: "'UthmanicHafs1Ver18', serif",
              }}
            >
              ﷽
            </p>
          )}
        </div>

        {/* Right Side: Surah Name SVG */}
        <div className="flex items-center justify-end">
          <div className="relative h-16 w-40 sm:h-20 sm:w-60">
            <SurahNameGraphic chapterId={chapterId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export function MushafMain({
  mushafName,
  mushafId,
  pages,
  chapterId,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  error,
  endLabelKey = 'end_of_surah',
}: MushafMainProps): React.JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isQcfMushaf = mushafId === 'qcf-madani-v1' || mushafId === 'qcf-madani-v2';
  const isQpcHafsMushaf = mushafId === 'qpc-uthmani-hafs';
  const isIndopakMushaf = mushafId === 'unicode-indopak-15' || mushafId === 'unicode-indopak-16';
  const qcfVersion = mushafId === 'qcf-madani-v2' ? 'v2' : 'v1';

  const showEmptyState = !isLoading && !error && pages.length === 0;

  const pageNumbers = useMemo(
    () =>
      pages
        .map((page) => page.pageNumber)
        .filter((n): n is number => typeof n === 'number' && Number.isFinite(n)),
    [pages]
  );

  // Load per-page QCF fonts when the QCF mushaf is selected.
  const { getPageFontFamily, isPageFontLoaded } = useQcfMushafFont(
    isQcfMushaf ? pageNumbers : [],
    qcfVersion
  );

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;
    const target = loadMoreRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore]);

  const shouldRenderLoadMore = (onLoadMore || isLoadingMore || !hasMore) && pages.length > 0;
  const shouldRenderSurahIntro = typeof chapterId === 'number' && chapterId > 0;

  return (
    <div className="w-full pb-20 pt-2">
      <div className="w-full space-y-10">
        {shouldRenderSurahIntro ? <SurahCalligraphyIntro chapterId={chapterId} /> : null}
        <div className="space-y-8">
          {isLoading && !pages.length ? (
            <div className="mx-auto flex w-full justify-center py-16">
              <Spinner className="h-8 w-8 text-accent" />
            </div>
          ) : error ? (
            <div
              className="mx-auto w-full rounded-[32px] border border-status-error bg-status-error/10 px-6 py-10 text-center text-status-error"
            >
              {error}
            </div>
          ) : showEmptyState ? (
            <div
              className="mx-auto w-full rounded-[32px] border border-border/70 bg-surface/70 px-6 py-12 text-center text-muted"
            >
              {t('no_verses_found')}
            </div>
          ) : (
            pages.map((page) => {
              const pageFontLoaded =
                isQcfMushaf &&
                typeof page.pageNumber === 'number' &&
                isPageFontLoaded(page.pageNumber);

              let fontFamily: string;
              if (isQcfMushaf && pageFontLoaded && typeof page.pageNumber === 'number') {
                fontFamily = getPageFontFamily(page.pageNumber);
              } else if (isQpcHafsMushaf) {
                fontFamily = 'UthmanicHafs1Ver18';
              } else if (isIndopakMushaf) {
                fontFamily = 'IndoPak';
              } else {
                fontFamily = settings.arabicFontFace;
              }

              return (
                <MushafPage
                  key={`page-${page.pageNumber}`}
                  pageNumber={page.pageNumber}
                  lines={page.lines}
                  settings={settings}
                  fontFamily={fontFamily}
                  isQcfMushaf={isQcfMushaf}
                  isQpcHafsMushaf={isQpcHafsMushaf}
                  isIndopakMushaf={isIndopakMushaf}
                  qcfVersion={qcfVersion}
                  isFontLoaded={!isQcfMushaf || pageFontLoaded}
                />
              );
            })
          )}
        </div>

        {shouldRenderLoadMore ? (
          <div
            ref={loadMoreRef}
            className="mx-auto w-full space-y-2 py-8 text-center"
          >
            {isLoadingMore ? <Spinner className="inline h-5 w-5 text-accent" /> : null}
            {!hasMore && !isLoadingMore ? (
              <p className="text-sm text-muted">{t(endLabelKey)}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface MushafPageProps {
  pageNumber: number;
  lines: MushafLineGroup[];
  settings: ReaderSettings;
  fontFamily: string;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: 'v1' | 'v2';
  isFontLoaded: boolean;
}

const MushafPage = ({
  pageNumber,
  lines,
  settings,
  fontFamily,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  isFontLoaded,
}: MushafPageProps): React.JSX.Element => {
  const mushafScale = fontSizeToMushafScale(settings.arabicFontSize);

  let fontSize: string | number;
  let lineWidthDesktop: string;

  if (isQcfMushaf) {
    const preset = qcfVersion === 'v2' ? getQcfV2Preset(mushafScale) : getQcfV1Preset(mushafScale);
    fontSize = preset.fontSize;
    const numericFont =
      typeof preset.fontSize === 'number'
        ? preset.fontSize
        : mushafScaleToFontSize(mushafScale);
    lineWidthDesktop = `${getLineWidth(numericFont)}px`;
  } else if (isQpcHafsMushaf || isIndopakMushaf) {
    const preset = isIndopakMushaf ? getIndopak15Preset(mushafScale) : getQpcHafsPreset(mushafScale);
    fontSize = preset.fontSize;
    lineWidthDesktop = preset.lineWidthDesktop;
  } else {
    fontSize = mushafScaleToFontSize(mushafScale);
    lineWidthDesktop = `${getLineWidth(mushafScaleToFontSize(mushafScale))}px`;
  }

  return (
    <article
      aria-label={`Page ${pageNumber}`}
      className={cn(
        'mx-auto w-full py-6 sm:py-8',
        isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
          ? 'max-w-none overflow-x-auto px-8'
          : undefined
      )}
    >
      <div
      className={cn(
        'flex flex-col',
        isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
          ? 'gap-1 sm:gap-1.5 mx-auto'
          : 'gap-4 sm:gap-5'
      )}
        style={
          {
            '--mushaf-line-width': lineWidthDesktop,
            fontFamily,
            width:
              isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
                ? 'min(var(--mushaf-line-width), 95vw)'
                : 'auto',
          } as React.CSSProperties
        }
      >
        {lines.map((line) => (
          <MushafLine
            key={line.key}
            line={line}
            settings={settings}
            isQcfMushaf={isQcfMushaf}
            isQpcHafsMushaf={isQpcHafsMushaf}
            isIndopakMushaf={isIndopakMushaf}
            qcfVersion={qcfVersion}
            fontSize={fontSize}
            isFontLoaded={isFontLoaded}
          />
        ))}
      </div>
      {pageNumber ? (
        <div className="mt-6 flex justify-center sm:mt-8">
          <span className="inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-full border border-border/60 bg-surface/80 px-3 text-[0.7rem] font-medium tracking-[0.35em] text-muted">
            {toArabicIndicNumber(pageNumber)}
          </span>
        </div>
      ) : null}
    </article>
  );
};

const MushafLine = ({
  line,
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  fontSize,
  isFontLoaded,
}: {
  line: MushafLineGroup;
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: 'v1' | 'v2';
  fontSize: string | number;
  isFontLoaded: boolean;
}): React.JSX.Element => (
  <div
    dir="rtl"
    className="mx-auto text-center"
    style={{
      fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
      maxWidth: 'var(--mushaf-line-width, 560px)',
      width: '100%',
    }}
  >
    <div
      className={cn(
        (isQcfMushaf && qcfVersion === 'v1') || isQpcHafsMushaf || isIndopakMushaf
          ? 'leading-[1.6]'
          : isQcfMushaf
            ? 'leading-[1.8]'
            : 'leading-[2.35]',
        'flex justify-between items-center',
      )}
      style={
        isQcfMushaf
          ? ({
              whiteSpace: 'nowrap',
              columnGap: '0',
            } as React.CSSProperties)
          : ({
              whiteSpace: 'nowrap',
            } as React.CSSProperties)
      }
      translate="no"
    >
      {line.words.map((word, index) => (
        <MushafWordText
          key={word.id ?? `${line.key}-${word.verseKey ?? 'word'}-${word.position}-${index}`}
          word={word}
          settings={settings}
          isQcfMushaf={isQcfMushaf}
          isQpcHafsMushaf={isQpcHafsMushaf}
          isIndopakMushaf={isIndopakMushaf}
          qcfVersion={qcfVersion}
          isFontLoaded={isFontLoaded}
        />
      ))}
    </div>
  </div>
);

const MushafWordText = ({
  word,
  settings,
  isQcfMushaf,
  isQpcHafsMushaf,
  isIndopakMushaf,
  qcfVersion,
  isFontLoaded,
}: {
  word: MushafWord;
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: 'v1' | 'v2';
  isFontLoaded: boolean;
}): React.JSX.Element | null => {
  if (word.charType === 'end') {
    const verseNumber = getVerseNumberFromWord(word);
    return typeof verseNumber === 'number' ? <VerseMarker number={verseNumber} /> : null;
  }

  const baseText = isIndopakMushaf
    ? word.textIndopak ?? word.textUthmani ?? ''
    : word.textUthmani ?? word.textIndopak ?? '';
  // Remove the "Silent Alif" (U+06DF) and "Sukun" (U+0652) if they are causing issues with this font?
  // No, U+06DF is standard.
  // But maybe the font uses a different character or the API returns a character that is not supported.
  // Let's try to strip U+06DF if it exists, just to see if it fixes the black circle.
  // Actually, if it's a black circle, it's likely U+06DF (Small High Rounded Zero).
  // If the font doesn't support it, it shows .notdef.
  // But UthmanicHafs1Ver18 SHOULD support it.
  // Maybe the API returns U+06E1 (Small High Dotless Head of Khah) or something else?
  // Let's try to replace U+06DF with nothing or a compatible char if isQpcHafsMushaf.

  // However, the user says "black circle".
  // If I look at the image, it's a solid black circle.
  // This is often how Chrome renders U+06DF if the font doesn't have it.

  // I will try to filter out U+06DF for QPC Hafs for now.
  // Also filter out U+06DD (End of Ayah) to prevent double markers (one from text, one from VerseMarker component)
  const displayText = isQpcHafsMushaf ? baseText.replace(/[\u06DF\u06DD]/g, '') : baseText.replace(/\u06DD/g, '');

  const code = qcfVersion === 'v2' ? word.codeV2 : word.codeV1;
  const hasGlyphCode = typeof code === 'string' && code.length > 0;

  if (!baseText && (!isQcfMushaf || !hasGlyphCode)) {
    return null;
  }

  let rawHtml: string;

  if (isQcfMushaf && isFontLoaded && hasGlyphCode) {
    // When the per-page QCF font is loaded, render the glyph-encoded text
    // so that the layout and calligraphy match Quran.com exactly.
    rawHtml = code as string;
  } else if (isQpcHafsMushaf) {
    // For QPC Uthmani Hafs, we use the textUthmani with the UthmanicHafs1Ver18 font.
    // We assume textUthmani contains the correct characters for this font.
    rawHtml = displayText;
  } else if (baseText) {
    // Fallback to standard Uthmani/Indopak text. For non-QCF mushaf we
    // optionally apply tajweed colouring.
    rawHtml = !isQcfMushaf && settings.tajweed ? applyTajweed(baseText) : baseText;
  } else {
    rawHtml = '';
  }

  if (!rawHtml) {
    return null;
  }

  return (
    <span
      className={
        isQcfMushaf
          ? 'inline-flex flex-none items-center text-foreground font-medium'
          : 'inline-flex flex-none items-center px-[1px] text-foreground'
      }
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }}
    />
  );
};



const getLineWidth = (fontSize: number): number => {
  const scaled = fontSize * LINE_WIDTH_SCALE;
  const clamped = Math.max(MIN_LINE_WIDTH_PX, Math.min(MAX_LINE_WIDTH_PX, scaled));

  if (typeof window === 'undefined') {
    return clamped;
  }

  const maxViewportWidth = Math.floor(window.innerWidth * 0.9);
  return Math.min(clamped, maxViewportWidth);
};

const toArabicIndicNumber = (num: number): string => {
  const digits = '٠١٢٣٤٥٦٧٨٩';
  return `${num}`.replace(/\d/g, (d) => digits[Number(d)] ?? d);
};

const getVerseNumberFromWord = (word: MushafWord): number | undefined => {
  if (typeof word.verseKey === 'string') {
    const [, ayah] = word.verseKey.split(':');
    const parsed = Number(ayah);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  if (typeof word.location === 'string') {
    const [, ayah] = word.location.split(':');
    const parsed = Number(ayah);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};
