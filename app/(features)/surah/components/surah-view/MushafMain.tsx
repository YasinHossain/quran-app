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
} from '@/app/(features)/surah/hooks/qcfScalePresets';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { Spinner } from '@/app/shared/Spinner';
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import { cn } from '@/lib/utils/cn';

import type { Chapter, MushafLineGroup, MushafPageLines, MushafWord } from '@/types';
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

const BISMILLAH_TEXT = 'بِسْمِ ٱللّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
const MIN_LINE_WIDTH_PX = 440;
const MAX_LINE_WIDTH_PX = 540;
const LINE_WIDTH_SCALE = 16;

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
  const { chapters } = useSurahNavigationData();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isQcfMushaf = mushafId === 'qcf-madani-v1' || mushafId === 'qcf-madani-v2';
  const isQpcHafsMushaf = mushafId === 'qpc-uthmani-hafs';
  const isIndopakMushaf = mushafId === 'unicode-indopak-15' || mushafId === 'unicode-indopak-16';
  const qcfVersion = mushafId === 'qcf-madani-v2' ? 'v2' : 'v1';

  const chapter = useMemo<Chapter | undefined>(() => {
    if (typeof chapterId !== 'number') return undefined;
    return chapters.find((entry) => entry.id === chapterId);
  }, [chapters, chapterId]);
  const showBismillah = Boolean(chapter?.id && chapter.id !== 9);
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

  return (
    <div className="w-full pb-20 pt-2">
      <div className="w-full space-y-10">
        <MushafHero
          mushafName={mushafName}
          isQcfMushaf={isQcfMushaf}
          chapter={chapter}
          settings={settings}
          showBismillah={showBismillah}
        />

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

interface MushafHeroProps {
  mushafName: string;
  isQcfMushaf: boolean;
  chapter?: Chapter | undefined;
  settings: ReaderSettings;
  showBismillah: boolean;
}

const MushafHero = ({
  mushafName,
  isQcfMushaf,
  chapter,
  settings,
  showBismillah,
}: MushafHeroProps): React.JSX.Element => {
  const chapterNumber = chapter?.id;
  const heroSubtitle = chapter?.translated_name?.name ?? undefined;
  const heroFootnote = chapter
    ? [`Surah ${chapter.name_simple}`, `${chapter.verses_count} ayat`].filter(Boolean).join(' • ')
    : undefined;
  const mushafScale = fontSizeToMushafScale(settings.arabicFontSize);
  const mushafFontSize = mushafScaleToFontSize(mushafScale);
  const bismillahFontSize = Math.max(mushafFontSize + 6, mushafFontSize);

  return (
    <section
      className={cn(
        'mx-auto w-full rounded-[44px] border border-border/80 bg-surface px-6 py-8 text-center shadow-card sm:px-10 sm:py-10',
        isQcfMushaf && 'max-w-none'
      )}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.6em] text-muted">
        Mushaf reading
      </p>
      {chapterNumber ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.45em] text-muted/80">
          {String(chapterNumber).padStart(3, '0')}
        </p>
      ) : null}
      <p className="mt-4 text-3xl font-semibold text-foreground" dir="rtl">
        {chapter?.name_arabic ?? mushafName}
      </p>
      {heroSubtitle ? <p className="mt-2 text-base text-muted">{heroSubtitle}</p> : null}
      <p className="mt-4 text-sm font-medium text-muted">
        {heroFootnote ?? `Mushaf · ${mushafName}`}
      </p>
      <p className="mt-2 text-sm text-muted">{`Font • ${settings.arabicFontFace}`}</p>
      {showBismillah ? (
        <p
          className="mt-8 text-3xl leading-snug text-foreground"
          dir="rtl"
          style={{
            fontFamily: settings.arabicFontFace,
            fontSize: `${bismillahFontSize}px`,
          }}
        >
          {BISMILLAH_TEXT}
        </p>
      ) : null}
    </section>
  );
};

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

  let fontSizePx: number;
  let lineWidthDesktop: string;

  if (isQcfMushaf) {
    const preset = qcfVersion === 'v2' ? getQcfV2Preset(mushafScale) : getQcfV1Preset(mushafScale);
    fontSizePx = preset.fontSizePx;
    lineWidthDesktop = preset.lineWidthDesktop;
  } else if (isQpcHafsMushaf || isIndopakMushaf) {
    const preset = getQpcHafsPreset(mushafScale);
    fontSizePx = preset.fontSizePx;
    lineWidthDesktop = preset.lineWidthDesktop;
  } else {
    fontSizePx = mushafScaleToFontSize(mushafScale);
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
                ? 'min(var(--mushaf-line-width), 100%)'
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
            fontSizePx={fontSizePx}
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
  fontSizePx,
  isFontLoaded,
}: {
  line: MushafLineGroup;
  settings: ReaderSettings;
  isQcfMushaf: boolean;
  isQpcHafsMushaf: boolean;
  isIndopakMushaf: boolean;
  qcfVersion: 'v1' | 'v2';
  fontSizePx: number;
  isFontLoaded: boolean;
}): React.JSX.Element => (
  <div
    dir="rtl"
      className="mx-auto text-center"
      style={{
        fontSize: `${fontSizePx}px`,
        maxWidth:
          isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf
            ? 'none'
            : 'min(var(--mushaf-line-width, 560px), 90vw)',
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
        'flex',
        isQcfMushaf || isQpcHafsMushaf || isIndopakMushaf ? 'justify-between' : 'justify-center'
      )}
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
          ? 'inline-block text-foreground font-medium'
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
