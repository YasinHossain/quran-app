import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { BookOpenIcon, ChevronRightIcon, InfoIcon } from '@/app/shared/icons';
import {
  buildSurahAboutRoute,
  buildSurahRoute,
  buildTafsirRoute,
} from '@/app/shared/navigation/routes';
import { SURAH_TOTAL, type SurahFacts } from '@/lib/seo/surahFacts';
import { type SurahWordStats } from '@/lib/seo/surahStats';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

import { focusRing, labelClass, QURAN_FONT } from './aboutUi';
import { OpeningClosingCard } from './OpeningClosingCard';
import { SurahOverviewCard, type SurahAboutRecitation } from './SurahOverviewCard';
import { TafsirIntroCard, type SurahTafsirIntro } from './TafsirIntroCard';
import { VerseLengthChart } from './VerseLengthChart';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { Chapter, PrerenderedVerse } from '@/types';

export type { SurahTafsirIntro };

/**
 * "About this surah" page. Its own visual language (not the reader's): a hero with the Arabic name
 * on a star medallion, one overview card (facts, recitation, 30-juz strip), the opening of Tafsir
 * Ibn Kathir, a words-per-verse chart, and the first and last verse in one card. Sections are
 * full width; nothing is paired side by side whose content height varies by surah.
 * Every fact comes from data (`SurahFacts`, `SurahWordStats`, the API); nothing is written per surah.
 */

interface SurahAboutViewProps {
  translator: ServerTranslator;
  chapter: Chapter;
  facts: SurahFacts;
  summary: string[];
  wordStats: SurahWordStats | null;
  /** Ibn Kathir's opening commentary; `undefined` when no edition could be loaded. */
  tafsirIntro: SurahTafsirIntro | undefined;
  recitation: SurahAboutRecitation | undefined;
  firstVerse: PrerenderedVerse | undefined;
  lastVerse: PrerenderedVerse | undefined;
  previous: Chapter | undefined;
  next: Chapter | undefined;
}

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/** 8-point star (two overlapping squares), the outline used for the medallion and the pattern. */
function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  return range(0, 15)
    .map((index) => {
      const radius = index % 2 === 0 ? outer : inner;
      const angle = (Math.PI / 8) * index - Math.PI / 2;
      return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
    })
    .join(' ');
}

const PATTERN_STAR = starPoints(24, 24, 11, 6.5);
const MEDALLION_OUTER = starPoints(100, 100, 96, 74);
const MEDALLION_INNER = starPoints(100, 100, 84, 66);

function GeometricBackdrop(): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-accent opacity-[0.09] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
    >
      <defs>
        <pattern id="surah-about-stars" width="48" height="48" patternUnits="userSpaceOnUse">
          <polygon points={PATTERN_STAR} fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="0" r="2" fill="currentColor" />
          <circle cx="48" cy="48" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#surah-about-stars)" />
    </svg>
  );
}

function ArabicMedallion({
  nameArabic,
  number,
}: {
  nameArabic: string;
  number: string;
}): React.JSX.Element {
  return (
    <div className="relative mx-auto grid aspect-square w-44 shrink-0 place-items-center sm:w-56 md:w-64">
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <polygon
          points={MEDALLION_OUTER}
          className="fill-accent/10 stroke-accent/40"
          strokeWidth="1.25"
        />
        <polygon
          points={MEDALLION_INNER}
          className="fill-surface/80 stroke-accent/25"
          strokeWidth="1"
        />
        <circle cx="100" cy="100" r="58" className="fill-none stroke-accent/20" strokeWidth="1" />
      </svg>
      <div className="relative flex flex-col items-center">
        <span
          lang="ar"
          dir="rtl"
          className="text-base text-muted sm:text-lg"
          style={{ fontFamily: QURAN_FONT }}
        >
          سورة
        </span>
        <span
          lang="ar"
          dir="rtl"
          className="text-4xl leading-tight text-foreground sm:text-5xl"
          style={{ fontFamily: QURAN_FONT }}
        >
          {nameArabic}
        </span>
        <span className="mt-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-accent">
          {number}
        </span>
      </div>
    </div>
  );
}

function Breadcrumbs({
  translator,
  chapter,
}: {
  translator: ServerTranslator;
  chapter: Chapter;
}): React.JSX.Element {
  const { locale } = translator;
  const crumbs = [
    { label: translator.t('home'), href: localizeHref('/', locale) },
    { label: translator.t('surah_tab'), href: localizeHref('/surah', locale) },
    {
      label: translator.chapterName(chapter),
      href: localizeHref(buildSurahRoute(chapter.id), locale),
    },
  ];
  return (
    <nav aria-label={translator.t('verse_page_breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <Link
              href={crumb.href}
              prefetch={false}
              className={cn('rounded-sm transition-colors hover:text-accent', focusRing)}
            >
              {crumb.label}
            </Link>
            <ChevronRightIcon size={12} aria-hidden="true" className="opacity-50 rtl:rotate-180" />
          </li>
        ))}
        <li aria-current="page" className="font-medium text-foreground">
          {translator.t('surah_about_breadcrumb')}
        </li>
      </ol>
    </nav>
  );
}

function Hero({
  translator,
  chapter,
  facts,
  summary,
}: Pick<SurahAboutViewProps, 'translator' | 'chapter' | 'facts' | 'summary'>): React.JSX.Element {
  const { locale } = translator;
  const digits = (value: number): string => localizeDigits(String(value), locale);
  const name = translator.chapterName(chapter);
  const meaning = locale === 'en' ? chapter.translated_name?.name : undefined;

  return (
    <section
      aria-labelledby="surah-about-heading"
      className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/[0.09] via-surface to-surface shadow-sm"
    >
      <GeometricBackdrop />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
        <div className="order-2 flex flex-col gap-4 md:order-1">
          <p
            className={cn(
              'inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-accent',
              labelClass(locale),
              'text-accent'
            )}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {translator.t('surah_about_eyebrow', {
              number: digits(chapter.id),
              total: digits(SURAH_TOTAL),
            })}
          </p>
          <div className="space-y-2">
            <h1
              id="surah-about-heading"
              className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1]"
            >
              {translator.t('surah_about_heading', { name })}
            </h1>
            {meaning ? <p className="text-lg text-muted sm:text-xl">“{meaning}”</p> : null}
          </div>
          <p
            data-slot="surah-about-summary"
            className="max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg"
          >
            {summary.join(' ')}
          </p>
          {facts.beginsWithoutBasmala ? (
            <p
              data-slot="surah-about-no-basmala"
              className="flex max-w-2xl items-start gap-2.5 rounded-xl border border-accent/25 bg-accent/[0.07] px-4 py-3 text-sm text-foreground"
            >
              <InfoIcon size={18} aria-hidden="true" className="mt-px shrink-0 text-accent" />
              {translator.t('surah_about_no_basmala')}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={localizeHref(buildSurahRoute(chapter.id), locale)}
              className={cn(
                'inline-flex min-h-touch items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover',
                focusRing
              )}
            >
              <BookOpenIcon size={18} aria-hidden="true" />
              {translator.t('verse_page_read_surah', {
                surah: translator.t('seo_surah_name', { name }),
              })}
            </Link>
            <Link
              href={localizeHref(buildTafsirRoute(chapter.id, 1), locale)}
              prefetch={false}
              className={cn(
                'inline-flex min-h-touch items-center gap-1.5 rounded-full border border-border bg-surface/70 px-5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-accent/40 hover:text-accent',
                focusRing
              )}
            >
              {translator.t('surah_about_tafsir_first_verse')}
              <ChevronRightIcon size={16} aria-hidden="true" className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <ArabicMedallion nameArabic={chapter.name_arabic} number={digits(chapter.id)} />
        </div>
      </div>
    </section>
  );
}

function NeighbourLink({
  translator,
  chapter,
  direction,
}: {
  translator: ServerTranslator;
  chapter: Chapter | undefined;
  direction: 'previous' | 'next';
}): React.JSX.Element {
  if (!chapter) return <span aria-hidden="true" />;
  const { locale } = translator;
  const isNext = direction === 'next';

  return (
    <Link
      href={localizeHref(buildSurahAboutRoute(chapter.id), locale)}
      rel={isNext ? 'next' : 'prev'}
      className={cn(
        'group flex min-h-touch items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40 sm:p-5',
        isNext && 'flex-row-reverse text-end',
        focusRing
      )}
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-interactive text-muted transition-colors group-hover:bg-accent group-hover:text-on-accent"
      >
        <ChevronRightIcon
          size={18}
          className={isNext ? 'rtl:rotate-180' : 'rotate-180 rtl:rotate-0'}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs text-muted">
          {translator.t(isNext ? 'surah_about_next' : 'surah_about_previous')}
        </span>
        <span className="truncate font-semibold text-foreground">
          {translator.chapterName(chapter)}
        </span>
      </span>
      {/* In Arabic the localized name already is the Arabic name. */}
      {locale === 'ar' ? null : (
        <span
          lang="ar"
          dir="rtl"
          className="hidden text-xl text-muted sm:block"
          style={{ fontFamily: QURAN_FONT }}
        >
          {chapter.name_arabic}
        </span>
      )}
    </Link>
  );
}

export function SurahAboutView({
  translator,
  chapter,
  facts,
  summary,
  wordStats,
  tafsirIntro,
  recitation,
  firstVerse,
  lastVerse,
  previous,
  next,
}: SurahAboutViewProps): React.JSX.Element {
  const { locale } = translator;
  // Only show a verse when it really is the first/last one (a partial API response is not).
  const opening = firstVerse?.verseKey === `${chapter.id}:1` ? firstVerse : undefined;
  const closing =
    lastVerse?.verseKey === `${chapter.id}:${chapter.verses_count}` ? lastVerse : undefined;
  // The last summary sentence is the location one when pages and juz are known.
  const caption = facts.pages && facts.juz ? (summary[summary.length - 1] ?? '') : '';
  const verseRows = [
    ...(opening ? [{ label: translator.t('surah_about_opening'), verse: opening }] : []),
    ...(closing ? [{ label: translator.t('surah_about_closing'), verse: closing }] : []),
  ];

  return (
    <main
      data-slot="surah-about-page"
      className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-28 pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top)+1rem)] text-foreground sm:px-6 md:gap-10"
    >
      <div className="flex flex-col gap-4">
        <Breadcrumbs translator={translator} chapter={chapter} />
        <Hero translator={translator} chapter={chapter} facts={facts} summary={summary} />
      </div>

      <SurahOverviewCard
        translator={translator}
        chapter={chapter}
        facts={facts}
        wordStats={wordStats}
        recitation={recitation}
        caption={caption}
      />

      {tafsirIntro ? (
        <TafsirIntroCard translator={translator} surahId={chapter.id} intro={tafsirIntro} />
      ) : null}

      {wordStats ? (
        <VerseLengthChart translator={translator} surahId={chapter.id} stats={wordStats} />
      ) : null}

      {verseRows.length ? <OpeningClosingCard translator={translator} rows={verseRows} /> : null}

      <nav aria-labelledby="surah-about-explore" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="surah-about-explore" className="text-lg font-semibold text-foreground">
            {translator.t('surah_about_explore')}
          </h2>
          <Link
            href={localizeHref('/surah', locale)}
            className={cn(
              'inline-flex min-h-touch items-center rounded-full px-3 text-sm font-semibold text-accent hover:bg-accent/10',
              focusRing
            )}
          >
            {translator.t('surah_about_all_surahs')}
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <NeighbourLink translator={translator} chapter={previous} direction="previous" />
          <NeighbourLink translator={translator} chapter={next} direction="next" />
        </div>
      </nav>

      <aside
        aria-labelledby="surah-about-sources"
        className="flex gap-3 border-t border-border pt-6 text-sm text-muted"
      >
        <InfoIcon size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h2 id="surah-about-sources" className="font-semibold text-foreground">
            {translator.t('surah_about_sources_heading')}
          </h2>
          <p className="max-w-3xl leading-relaxed">{translator.t('surah_about_sources')}</p>
        </div>
      </aside>
    </main>
  );
}
