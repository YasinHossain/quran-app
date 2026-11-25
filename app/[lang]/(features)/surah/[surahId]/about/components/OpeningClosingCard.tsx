import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { ChevronRightIcon } from '@/app/shared/icons';
import { buildVerseRoute } from '@/app/shared/navigation/routes';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

import { focusRing, labelClass, QURAN_FONT, sectionCardClass } from './aboutUi';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { PrerenderedVerse } from '@/types';

/**
 * The first and last verse in one card, as stacked rows (a label column beside the text on wide
 * screens). Stacking instead of two side-by-side cards keeps a one-word verse (2:1) and a long one
 * (2:286) from producing cards of very different heights.
 */
export function OpeningClosingCard({
  translator,
  rows,
}: {
  translator: ServerTranslator;
  rows: Array<{ label: string; verse: PrerenderedVerse }>;
}): React.JSX.Element {
  return (
    <section
      aria-label={rows.map((row) => row.label).join(' · ')}
      className={cn(sectionCardClass, 'divide-y divide-border overflow-hidden')}
    >
      {rows.map(({ label, verse }) => (
        <VerseRow key={verse.verseKey} translator={translator} label={label} verse={verse} />
      ))}
    </section>
  );
}

function VerseRow({
  translator,
  label,
  verse,
}: {
  translator: ServerTranslator;
  label: string;
  verse: PrerenderedVerse;
}): React.JSX.Element {
  const { locale } = translator;
  const [surahId = '', verseId = ''] = verse.verseKey.split(':');
  const translation = verse.translations[0];

  return (
    <article
      data-verse-key={verse.verseKey}
      className="grid gap-4 p-5 sm:p-6 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8"
    >
      <header className="flex items-center justify-between gap-3 md:flex-col md:items-start md:justify-start">
        <h2 className={labelClass(locale)}>{label}</h2>
        <Link
          href={localizeHref(buildVerseRoute(surahId, verseId), locale)}
          prefetch={false}
          className={cn(
            'inline-flex min-h-touch items-center gap-1 rounded-full bg-accent/10 px-3 text-sm font-semibold tabular-nums text-accent transition-colors hover:bg-accent/20 md:-ms-1',
            focusRing
          )}
        >
          {localizeDigits(verse.verseKey, locale)}
          <ChevronRightIcon size={14} aria-hidden="true" className="rtl:rotate-180" />
        </Link>
      </header>
      <div className="min-w-0 space-y-4">
        <p
          lang="ar"
          dir="rtl"
          className="text-start text-2xl leading-[2.15] text-foreground sm:text-[1.75rem]"
          style={{ fontFamily: QURAN_FONT }}
        >
          {verse.arabic}
        </p>
        {translation ? (
          <figure className="space-y-1.5">
            <p
              lang={translation.languageCode ?? locale}
              dir="auto"
              className="leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: translation.html }}
            />
            {translation.resourceName ? (
              <figcaption className="text-xs text-muted">{translation.resourceName}</figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
    </article>
  );
}
