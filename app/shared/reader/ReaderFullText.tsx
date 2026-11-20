import Link from 'next/link';
import React from 'react';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildVerseRoute } from '@/app/shared/navigation/routes';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { PrerenderedVerse } from '@/types';

/**
 * Server component: the complete text of a surah or juz in a collapsed `<details>` section.
 *
 * The interactive reader above it is virtualized and only mounts the verses near the viewport,
 * so this section is what keeps every verse in the HTML and in the rendered DOM (search engines,
 * screen readers, find-in-page, copying text). It has no client code; it is rendered once on
 * the server and passed into the reader tree as a ready-made node.
 */
interface ReaderFullTextProps {
  title: string;
  verses: PrerenderedVerse[];
  /** Language and direction of the summary label (the page's UI language). */
  lang?: string | undefined;
  dir?: 'ltr' | 'rtl' | undefined;
  /** Language of the verse page links (each verse key links to `/surah/s/v` in it). */
  locale?: UiLanguageCode | undefined;
}

const verseHref = (verseKey: string, locale: UiLanguageCode): string | null => {
  const [surahId, verseId] = verseKey.split(':');
  return surahId && verseId ? localizeHref(buildVerseRoute(surahId, verseId), locale) : null;
};

const ARABIC_FONT_FAMILY = "'UthmanicHafs1Ver18', serif";

export function ReaderFullText({
  title,
  verses,
  lang,
  dir,
  locale = 'en',
}: ReaderFullTextProps): React.JSX.Element | null {
  if (!verses.length) return null;

  return (
    <details
      data-slot="reader-full-text"
      {...(lang ? { lang } : {})}
      {...(dir ? { dir } : {})}
      className="group mt-10 w-full rounded-lg border border-border bg-surface"
    >
      <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-foreground hover:bg-interactive-hover [&::-webkit-details-marker]:hidden">
        <h2 className="text-sm font-medium">{title}</h2>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <ol className="divide-y divide-border border-t border-border px-4">
        {verses.map((verse) => {
          const href = verseHref(verse.verseKey, locale);
          return (
            <li key={verse.verseKey} data-verse-key={verse.verseKey} className="space-y-3 py-5">
              <p className="text-xs font-semibold text-muted">
                {href ? (
                  <Link
                    href={href}
                    prefetch={false}
                    className="rounded-sm hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {verse.verseKey}
                  </Link>
                ) : (
                  verse.verseKey
                )}
              </p>
              <p
                lang="ar"
                dir="rtl"
                className="text-right text-2xl leading-loose text-foreground"
                style={{ fontFamily: ARABIC_FONT_FAMILY }}
              >
                {verse.arabic}
              </p>
              {verse.translations.map((translation) => (
                <p
                  key={translation.resourceId}
                  {...(translation.languageCode ? { lang: translation.languageCode } : {})}
                  dir="auto"
                  className="text-base leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: translation.html }}
                />
              ))}
            </li>
          );
        })}
      </ol>
    </details>
  );
}

/**
 * Summary label wording. Placeholders: `{{subject}}` and `{{translations}}`. The English defaults
 * match the `reader_full_text_title*` locale keys.
 */
export interface FullTextTitleTemplates {
  withTranslation: string;
  arabicOnly: string;
}

const DEFAULT_FULL_TEXT_TITLE_TEMPLATES: FullTextTitleTemplates = {
  withTranslation: 'Full text of {{subject}} — Arabic and {{translations}} translation',
  arabicOnly: 'Full text of {{subject}} — Arabic',
};

/** Summary label, e.g. "Full text of Surah Al-Baqarah — Arabic and Saheeh International translation". */
export function buildFullTextTitle(
  subject: string,
  verses: PrerenderedVerse[],
  templates: FullTextTitleTemplates = DEFAULT_FULL_TEXT_TITLE_TEMPLATES
): string {
  const translationNames = Array.from(
    new Set(
      (verses[0]?.translations ?? [])
        .map((translation) => translation.resourceName)
        .filter((name): name is string => Boolean(name))
    )
  );
  const template = translationNames.length ? templates.withTranslation : templates.arabicOnly;
  return template
    .replace(/\{\{\s*subject\s*\}\}/g, () => subject)
    .replace(/\{\{\s*translations\s*\}\}/g, () => translationNames.join(', '));
}
