import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { ChevronRightIcon } from '@/app/shared/icons';
import { buildJuzRoute } from '@/app/shared/navigation/routes';
import { JUZ_COUNT, MUSHAF_PAGE_COUNT, type SurahFacts } from '@/lib/seo/surahFacts';
import { splitDuration, splitHoursMinutes } from '@/lib/seo/surahStats';
import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

import { focusRing, labelClass, QURAN_FONT, sectionCardClass } from './aboutUi';
import { RecitationPlayButton } from './RecitationPlayButton';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { SurahRecitation } from '@/lib/api/server';
import type { Chapter } from '@/types';

export type SurahAboutRecitation = SurahRecitation & { reciterName: string };

interface SurahOverviewCardProps {
  translator: ServerTranslator;
  chapter: Chapter;
  facts: SurahFacts;
  wordStats: { totalWords: number } | null;
  recitation: SurahAboutRecitation | undefined;
  /** The location sentence of the summary, shown under the juz strip. */
  caption: string;
}

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/**
 * "At a glance": every fact in one card. The stats share a hairline grid (each cell draws its
 * end and bottom border; the grid is pulled 1px past the card's clipped edge so the outer lines
 * disappear and a short last row leaves no stray lines), and the juz strip is the card's footer.
 */
export function SurahOverviewCard({
  translator,
  chapter,
  facts,
  wordStats,
  recitation,
  caption,
}: SurahOverviewCardProps): React.JSX.Element {
  const { locale } = translator;
  const digits = (value: number): string => localizeDigits(String(value), locale);
  const span = (start: number, end: number): string =>
    start === end ? digits(start) : `${digits(start)}–${digits(end)}`;

  return (
    <section
      aria-labelledby="surah-about-glance"
      data-slot="surah-about-overview"
      className={cn(sectionCardClass, 'overflow-hidden')}
    >
      <h2
        id="surah-about-glance"
        className="px-5 pt-5 text-lg font-semibold text-foreground sm:px-6 sm:pt-6"
      >
        {translator.t('surah_about_glance')}
      </h2>

      <div className="mt-4 overflow-hidden border-y border-border">
        <dl className="-mb-px -me-px grid grid-cols-2 sm:grid-cols-3">
          {facts.revelation ? (
            <Stat
              locale={locale}
              tinted
              label={translator.t('surah_about_fact_revelation')}
              value={translator.t(
                facts.revelation === 'makkah' ? 'surah_about_meccan' : 'surah_about_medinan'
              )}
              {...(locale === 'ar'
                ? {}
                : {
                    detail: (
                      <span
                        lang="ar"
                        dir="rtl"
                        className="text-base"
                        style={{ fontFamily: QURAN_FONT }}
                      >
                        {facts.revelation === 'makkah' ? 'مكية' : 'مدنية'}
                      </span>
                    ),
                  })}
            />
          ) : null}
          <Stat locale={locale} label={translator.t('verses')} value={digits(facts.versesCount)} />
          {wordStats ? (
            <Stat
              locale={locale}
              label={translator.t('surah_about_fact_words')}
              value={formatNumber(wordStats.totalWords, locale)}
            />
          ) : null}
          {facts.juz ? (
            <Stat
              locale={locale}
              label={translator.t('surah_about_fact_juz')}
              value={span(facts.juz.start, facts.juz.end)}
              detail={translator.t('surah_about_of_total', { total: digits(JUZ_COUNT) })}
            />
          ) : null}
          {facts.pages ? (
            <Stat
              locale={locale}
              label={translator.t(
                facts.pages.start === facts.pages.end
                  ? 'surah_about_fact_page'
                  : 'surah_about_fact_pages'
              )}
              value={span(facts.pages.start, facts.pages.end)}
              detail={translator.t('surah_about_of_total', { total: digits(MUSHAF_PAGE_COUNT) })}
            />
          ) : null}
          {recitation ? (
            <RecitationStat translator={translator} chapter={chapter} recitation={recitation} />
          ) : null}
        </dl>
      </div>

      {facts.juz ? <JuzStrip translator={translator} juz={facts.juz} caption={caption} /> : null}
    </section>
  );
}

function Stat({
  label,
  value,
  detail,
  note,
  locale,
  tinted,
  children,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  /** A small line under the value (e.g. the reciter). */
  note?: React.ReactNode;
  locale: string;
  tinted?: boolean;
  /** A control in the cell's corner (the recitation play button). */
  children?: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        'relative flex min-h-[7rem] flex-col justify-between gap-3 border-b border-e border-border p-4 sm:p-5',
        tinted && 'bg-accent/[0.06]'
      )}
    >
      <dt className={cn(labelClass(locale), children ? 'pe-12' : undefined)}>{label}</dt>
      <dd className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
          {value}
        </span>
        {detail ? <span className="text-sm text-muted">{detail}</span> : null}
        {note ? <span className="block w-full truncate text-xs text-muted">{note}</span> : null}
        {/* Inside the <dd>: a <dl> group may only hold <dt>/<dd> (positioned against the cell). */}
        {children}
      </dd>
    </div>
  );
}

function RecitationStat({
  translator,
  chapter,
  recitation,
}: {
  translator: ServerTranslator;
  chapter: Chapter;
  recitation: SurahAboutRecitation;
}): React.JSX.Element {
  const { locale } = translator;
  const { minutes, seconds } = splitDuration(recitation.durationMs);
  const long = minutes >= 60 ? splitHoursMinutes(recitation.durationMs) : null;
  const value = long ? (
    <>
      {localizeDigits(String(long.hours), locale)}
      <span className="ms-1 me-2 text-sm font-normal text-muted">
        {translator.t('surah_about_hours_unit')}
      </span>
      {localizeDigits(String(long.minutes), locale)}
    </>
  ) : (
    localizeDigits(`${minutes}:${String(seconds).padStart(2, '0')}`, locale)
  );

  return (
    <Stat
      locale={locale}
      label={translator.t('surah_about_fact_recitation')}
      value={value}
      detail={translator.t('surah_about_minutes_unit')}
      note={translator.t('surah_about_recited_by', { reciter: recitation.reciterName })}
    >
      <RecitationPlayButton
        src={recitation.audioUrl}
        playLabel={translator.t('surah_about_play', { name: translator.chapterName(chapter) })}
        pauseLabel={translator.t('surah_about_pause')}
      />
    </Stat>
  );
}

/** The 30 juz as a strip (in reading direction: right to left in ar/ur) with this surah's juz
 * filled. The strip is decorative; the caption and juz links carry the meaning. */
function JuzStrip({
  translator,
  juz,
  caption,
}: {
  translator: ServerTranslator;
  juz: NonNullable<SurahFacts['juz']>;
  caption: string;
}): React.JSX.Element {
  const { locale } = translator;

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <h3 id="surah-about-position" className="font-semibold text-foreground">
        {translator.t('surah_about_position_heading')}
      </h3>
      <div className="space-y-2">
        <div
          role="img"
          aria-label={translator.t('surah_about_position_label')}
          {...(caption ? { 'aria-describedby': 'surah-about-position-caption' } : {})}
          data-slot="surah-about-juz-strip"
          className="grid grid-cols-[repeat(30,minmax(0,1fr))] items-end gap-[3px] sm:gap-1"
        >
          {range(1, JUZ_COUNT).map((number) => {
            const isCovered = number >= juz.start && number <= juz.end;
            return (
              <span
                key={number}
                {...(isCovered ? { 'data-covered': 'true' } : {})}
                className={cn(
                  'rounded-[4px]',
                  isCovered
                    ? 'h-12 bg-accent shadow-[0_6px_16px_-6px_rgb(var(--color-accent)/0.7)] sm:h-14'
                    : 'h-8 bg-interactive sm:h-9'
                )}
              />
            );
          })}
        </div>
        <div
          aria-hidden="true"
          className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px] text-[10px] tabular-nums text-muted sm:gap-1"
        >
          {[1, 10, 20, 30].map((tick) => (
            <span key={tick} className="text-center" style={{ gridColumnStart: tick }}>
              {localizeDigits(String(tick), locale)}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="surah-about-position-caption" className="text-sm leading-relaxed text-muted">
          {caption}
        </p>
        <ul className="flex flex-wrap gap-2">
          {range(juz.start, juz.end).map((number) => (
            <li key={number}>
              <Link
                href={localizeHref(buildJuzRoute(number), locale)}
                prefetch={false}
                className={cn(
                  'inline-flex min-h-touch items-center gap-1 whitespace-nowrap rounded-full bg-accent/10 px-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/20',
                  focusRing
                )}
              >
                {localizeDigits(translator.t('juz_number', { number }), locale)}
                <ChevronRightIcon size={14} aria-hidden="true" className="rtl:rotate-180" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
