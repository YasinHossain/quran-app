import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildVerseRoute } from '@/app/shared/navigation/routes';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

import { cardClass, focusRing, labelClass } from './aboutUi';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { SurahWordStats, VerseExtreme } from '@/lib/seo/surahStats';

/**
 * Words per verse as a bar chart (one bar per verse, in reading direction: right to left in
 * Arabic and Urdu), with the longest verse highlighted and the longest and shortest verse linked.
 * Plain server-rendered markup; the bars are decorative and the stats below carry the meaning.
 */
export function VerseLengthChart({
  translator,
  surahId,
  stats,
}: {
  translator: ServerTranslator;
  surahId: number;
  stats: SurahWordStats;
}): React.JSX.Element {
  const { locale } = translator;
  const digits = (value: number): string => localizeDigits(String(value), locale);
  const { perVerse, longest } = stats;
  const max = longest.words;
  const count = perVerse.length;

  return (
    <section
      aria-labelledby="surah-about-lengths"
      data-slot="surah-about-verse-lengths"
      className={cn(cardClass, 'space-y-5')}
    >
      <h2 id="surah-about-lengths" className="text-lg font-semibold text-foreground">
        {translator.t('surah_about_length_heading')}
      </h2>
      <div className="space-y-2">
        <div
          role="img"
          aria-label={translator.t('surah_about_length_label', { count: digits(count) })}
          aria-describedby="surah-about-length-extremes"
          className={cn(
            'flex h-28 items-end sm:h-36',
            count > 120 ? 'gap-0' : count > 50 ? 'gap-px' : 'gap-0.5 sm:gap-1'
          )}
        >
          {perVerse.map((words, index) => (
            <span
              key={index}
              className={cn(
                'min-w-0 flex-1 rounded-t-[2px]',
                words === max ? 'bg-accent' : 'bg-accent/30'
              )}
              style={{ height: `${Math.max(4, (words / max) * 100)}%` }}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex justify-between text-[10px] tabular-nums text-muted"
        >
          <span>{digits(1)}</span>
          <span>{digits(count)}</span>
        </div>
      </div>
      <dl id="surah-about-length-extremes" className="grid gap-3 sm:grid-cols-2">
        <Extreme
          translator={translator}
          surahId={surahId}
          label={translator.t('surah_about_longest')}
          extreme={longest}
          highlight
        />
        <Extreme
          translator={translator}
          surahId={surahId}
          label={translator.t('surah_about_shortest')}
          extreme={stats.shortest}
        />
      </dl>
    </section>
  );
}

function Extreme({
  translator,
  surahId,
  label,
  extreme,
  highlight,
}: {
  translator: ServerTranslator;
  surahId: number;
  label: string;
  extreme: VerseExtreme;
  highlight?: boolean;
}): React.JSX.Element {
  const { locale } = translator;
  const digits = (value: number): string => localizeDigits(String(value), locale);
  const verseKey = `${surahId}:${extreme.verse}`;
  const words = translator.t(
    extreme.words === 1 ? 'surah_about_word_one' : 'surah_about_words_count',
    {
      count: digits(extreme.words),
    }
  );

  // One <dt> with two <dd>s (the count, then the verse link) keeps the <dl> valid.
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl bg-interactive/60 px-4 py-3">
      <dt className={cn(labelClass(locale), 'col-start-1 row-start-1')}>{label}</dt>
      <dd className="col-start-1 row-start-2 mt-1 flex flex-wrap items-baseline gap-x-2 text-foreground">
        <span className="font-semibold">{words}</span>
        {extreme.others > 0 ? (
          <span className="text-xs text-muted">
            {translator.t('surah_about_and_more', { count: digits(extreme.others) })}
          </span>
        ) : null}
      </dd>
      <dd className="col-start-2 row-span-2 row-start-1">
        <Link
          href={localizeHref(buildVerseRoute(surahId, extreme.verse), locale)}
          prefetch={false}
          className={cn(
            'inline-flex min-h-touch shrink-0 items-center rounded-full px-3 text-sm font-semibold tabular-nums transition-colors',
            highlight
              ? 'bg-accent text-on-accent hover:bg-accent-hover'
              : 'text-accent hover:bg-accent/10',
            focusRing
          )}
        >
          {localizeDigits(verseKey, locale)}
        </Link>
      </dd>
    </div>
  );
}
