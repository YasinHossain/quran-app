import Link from 'next/link';
import { notFound } from 'next/navigation';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import {
  getRequestUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  getVerseMetadataTemplates,
  type ServerTranslator,
} from '@/app/shared/i18n/serverLocale';
import {
  buildJuzRoute,
  buildSurahRoute,
  buildTafsirRoute,
  buildVerseRoute,
} from '@/app/shared/navigation/routes';
import {
  formatVerseKey,
  getGlobalVerseId,
  getNextVerse,
  getPreviousVerse,
  parseVerseAddress,
  type VerseAddress,
} from '@/app/shared/navigation/verseNavigation';
import {
  getChaptersServer,
  getVersePageTafsirServer,
  getVersePageVersesServer,
  toVerseCounts,
  type VersePageTafsir,
  type VersePageVerse,
  type VersePageVerses,
} from '@/lib/api/server';
import { buildLocalizedPageMetadata, localizedUrl } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';
import { resolveSurahParam } from '@/lib/seo/surahSlugs';
import { cleanTranslationText } from '@/lib/seo/tafsirMetadata';
import { buildTafsirExcerpt, buildVerseMetadataText } from '@/lib/seo/verseMetadata';

import { VersePageActions } from './components/VersePageActions';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Chapter } from '@/types';
import type { Metadata } from 'next';

// Rendered on demand (6,236 verses x languages are not pre-built); upstream data is cached.
export const revalidate = 3600;

interface VersePageProps {
  params: Promise<{ surahId: string; verseId: string }>;
}

const ARABIC_FONT_FAMILY = "'UthmanicHafs1Ver18', serif";

interface ResolvedVerse {
  address: VerseAddress;
  verseKey: string;
  chapter: Chapter;
  /** Quran.com verse id (1–6236), from chapter data. */
  globalVerseId: number;
  previous: VerseAddress | null;
  next: VerseAddress | null;
}

/**
 * Validates the params against chapter data; 404 for anything that is not an existing verse. The
 * surah segment is the slug (`al-baqarah`); `proxy.ts` redirects numbers and other spellings.
 */
async function resolveVerse(params: VersePageProps['params']): Promise<ResolvedVerse> {
  const { surahId, verseId } = await params;
  const surah = resolveSurahParam(surahId);
  if (!surah) notFound();
  const chapters = await getChaptersServer();
  const verseCounts = toVerseCounts(chapters);
  const address = parseVerseAddress(String(surah.id), verseId, verseCounts);
  const chapter = address && chapters.find((c) => c.id === address.surahId);
  if (!address || !chapter) notFound();

  return {
    address,
    verseKey: formatVerseKey(address),
    chapter,
    globalVerseId: getGlobalVerseId(address, verseCounts),
    previous: getPreviousVerse(address, verseCounts),
    next: getNextVerse(address, verseCounts),
  };
}

/** The verse and its context in one cached request; same arguments in metadata and page. */
const loadVerses = (resolved: ResolvedVerse, locale: UiLanguageCode): Promise<VersePageVerses> =>
  getVersePageVersesServer({
    surahId: resolved.address.surahId,
    verseKey: resolved.verseKey,
    globalVerseId: resolved.globalVerseId,
    translationIds: getServerReaderDefaults(locale).translationIds,
  });

const surahTitle = (translator: ServerTranslator, chapter: Chapter): string =>
  translator.t('seo_surah_name', { name: translator.chapterName(chapter) });

/** Text that leads the title/description: the first translation, or the Arabic text. */
const leadText = (verse: VersePageVerse | undefined): string | undefined =>
  verse ? (verse.translations[0]?.html ?? verse.arabic) : undefined;

export async function generateMetadata({ params }: VersePageProps): Promise<Metadata> {
  const resolved = await resolveVerse(params);
  const { address, verseKey, chapter } = resolved;
  const locale = await getRequestUiLanguage();
  const [translator, verse] = await Promise.all([
    getServerTranslator(locale),
    loadVerses(resolved, locale).then(
      (verses) => verses.verse,
      () => undefined
    ),
  ]);

  const { title, description } = buildVerseMetadataText({
    surahName: surahTitle(translator, chapter),
    verseKey,
    leadText: leadText(verse),
    templates: getVerseMetadataTemplates(translator),
  });

  return buildLocalizedPageMetadata({
    path: buildVerseRoute(address.surahId, address.verseId),
    locale,
    title,
    description,
  });
}

function buildVerseJsonLd(input: {
  translator: ServerTranslator;
  chapter: Chapter;
  address: VerseAddress;
  heading: string;
  verse: VersePageVerse;
}): Array<Record<string, unknown>> {
  const { translator, chapter, address, heading, verse } = input;
  const { locale } = translator;
  const surahUrl = localizedUrl(buildSurahRoute(address.surahId), locale);
  const verseUrl = localizedUrl(buildVerseRoute(address.surahId, address.verseId), locale);
  const translation = leadText(verse);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: SITE_NAME, item: localizedUrl('/', locale) },
        { name: translator.t('surah_tab'), item: localizedUrl('/surah', locale) },
        { name: translator.chapterName(chapter), item: surahUrl },
        { name: formatVerseKey(address), item: verseUrl },
      ].map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: heading,
      url: verseUrl,
      inLanguage: 'ar',
      text: verse.arabic,
      position: address.verseId,
      ...(verse.translations.length && translation
        ? {
            workTranslation: {
              '@type': 'CreativeWork',
              inLanguage: locale,
              text: cleanTranslationText(translation),
              ...(verse.translations[0]?.resourceName
                ? { name: verse.translations[0].resourceName }
                : {}),
            },
          }
        : {}),
      isPartOf: {
        '@type': 'Chapter',
        name: surahTitle(translator, chapter),
        url: surahUrl,
        position: chapter.id,
        isPartOf: { '@type': 'Book', name: 'The Holy Quran', url: localizedUrl('/', locale) },
      },
    },
  ];
}

const linkClass =
  'rounded-sm text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

function Breadcrumbs({
  translator,
  chapter,
  address,
}: {
  translator: ServerTranslator;
  chapter: Chapter;
  address: VerseAddress;
}): React.JSX.Element {
  const { locale } = translator;
  const crumbs = [
    { label: translator.t('home'), href: localizeHref('/', locale) },
    { label: translator.t('surah_tab'), href: localizeHref('/surah', locale) },
    {
      label: translator.chapterName(chapter),
      href: localizeHref(buildSurahRoute(address.surahId), locale),
    },
  ];

  return (
    <nav aria-label={translator.t('verse_page_breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <Link href={crumb.href} prefetch={false} className={linkClass}>
              {crumb.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-foreground">
          {formatVerseKey(address)}
        </li>
      </ol>
    </nav>
  );
}

function VerseNavLink({
  target,
  label,
  locale,
  direction,
}: {
  target: VerseAddress | null;
  label: string;
  locale: UiLanguageCode;
  direction: 'previous' | 'next';
}): React.JSX.Element {
  const alignment = direction === 'next' ? 'items-end text-end' : 'items-start text-start';
  if (!target) return <span aria-hidden="true" />;

  return (
    <Link
      href={localizeHref(buildVerseRoute(target.surahId, target.verseId), locale)}
      rel={direction === 'next' ? 'next' : 'prev'}
      data-verse-nav={direction}
      className={`flex min-h-touch flex-col justify-center gap-0.5 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${alignment}`}
    >
      <span className="text-xs text-muted">{label}</span>
      <span className="font-semibold text-accent">{formatVerseKey(target)}</span>
    </Link>
  );
}

function VerseTextCard({
  translator,
  verse,
  verseKey,
}: {
  translator: ServerTranslator;
  verse: VersePageVerse;
  verseKey: string;
}): React.JSX.Element {
  return (
    <article
      data-verse-key={verseKey}
      className="space-y-6 rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-accent">{verseKey}</span>
        <VersePageActions
          verseId={verse.id}
          verseKey={verseKey}
          arabic={verse.arabic}
          shareLabel={translator.t('share')}
        />
      </div>
      <p
        lang="ar"
        dir="rtl"
        data-slot="verse-arabic"
        className="text-right text-3xl leading-[2.2] text-foreground"
        style={{ fontFamily: ARABIC_FONT_FAMILY }}
      >
        {verse.arabic}
      </p>
      {verse.translations.map((translation) => (
        <figure key={translation.resourceId} className="space-y-2" data-slot="verse-translation">
          <p
            lang={translation.languageCode ?? translator.locale}
            dir="auto"
            className="text-lg leading-relaxed text-foreground"
            dangerouslySetInnerHTML={{ __html: translation.html }}
          />
          {translation.resourceName ? (
            <figcaption className="text-xs text-muted">— {translation.resourceName}</figcaption>
          ) : null}
        </figure>
      ))}
    </article>
  );
}

function VerseTafsirExcerpt({
  translator,
  address,
  tafsir,
}: {
  translator: ServerTranslator;
  address: VerseAddress;
  tafsir: VersePageTafsir | undefined;
}): React.JSX.Element {
  const excerpt = buildTafsirExcerpt(tafsir?.html);
  return (
    <section
      aria-labelledby="verse-tafsir-heading"
      data-slot="verse-tafsir"
      className="space-y-3 rounded-lg border border-border bg-surface p-4 sm:p-6"
    >
      <div>
        <h2 id="verse-tafsir-heading" className="text-lg font-semibold">
          {translator.t('tafsir_panel_title')}
        </h2>
        {tafsir?.name ? (
          <p className="text-sm text-muted">
            {translator.t('verse_page_tafsir_source', { name: tafsir.name })}
          </p>
        ) : null}
      </div>
      {excerpt ? (
        <p
          {...(tafsir?.languageCode ? { lang: tafsir.languageCode } : {})}
          dir="auto"
          className="leading-relaxed text-foreground"
        >
          {excerpt}
        </p>
      ) : null}
      <Link
        href={localizeHref(buildTafsirRoute(address.surahId, address.verseId), translator.locale)}
        className={`inline-flex min-h-touch items-center font-semibold ${linkClass}`}
      >
        {translator.t('verse_page_read_full_tafsir')}
      </Link>
    </section>
  );
}

/** "Page 42 · Juz 3" from the API's `page_number`/`juz_number`. The mushaf page route is not
 * indexable, so only the juz is a link. */
function VerseLocation({
  translator,
  verse,
}: {
  translator: ServerTranslator;
  verse: VersePageVerse;
}): React.JSX.Element | null {
  const { pageNumber, juzNumber } = verse;
  if (!pageNumber && !juzNumber) return null;
  return (
    <p className="text-sm text-muted" data-slot="verse-location">
      {pageNumber ? <span>{`${translator.t('page')} ${pageNumber}`}</span> : null}
      {pageNumber && juzNumber ? <span aria-hidden="true"> · </span> : null}
      {juzNumber ? (
        <Link
          href={localizeHref(buildJuzRoute(juzNumber), translator.locale)}
          className={linkClass}
        >
          {translator.t('juz_number', { number: juzNumber })}
        </Link>
      ) : null}
    </p>
  );
}

/** Neighbouring verses (same surah) with the current one highlighted. */
function VerseContext({
  translator,
  address,
  verses,
  className,
}: {
  translator: ServerTranslator;
  address: VerseAddress;
  verses: VersePageVerse[];
  className?: string;
}): React.JSX.Element | null {
  if (verses.length < 2) return null;
  const { locale } = translator;
  const currentKey = formatVerseKey(address);

  return (
    <section
      aria-labelledby="verse-context-heading"
      data-slot="verse-context"
      className={`space-y-3 rounded-lg border border-border bg-surface p-4 ${className ?? ''}`}
    >
      <h2 id="verse-context-heading" className="text-lg font-semibold">
        {translator.t('verse_page_context_heading')}
      </h2>
      <ol className="space-y-2">
        {verses.map((verse) => {
          const isCurrent = verse.verseKey === currentKey;
          const [surahId = '', verseId = ''] = verse.verseKey.split(':');
          const translation = verse.translations[0];
          return (
            <li
              key={verse.verseKey}
              data-context-verse-key={verse.verseKey}
              {...(isCurrent ? { 'aria-current': 'true' as const } : {})}
              className={`space-y-1 rounded-md p-3 ${isCurrent ? 'border-s-2 border-accent bg-accent/10' : ''}`}
            >
              <Link
                href={localizeHref(buildVerseRoute(surahId, verseId), locale)}
                prefetch={false}
                className={`text-xs font-semibold ${linkClass}`}
              >
                {verse.verseKey}
              </Link>
              {translation ? (
                <p
                  lang={translation.languageCode ?? locale}
                  dir="auto"
                  className="text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: translation.html }}
                />
              ) : (
                <p
                  lang="ar"
                  dir="rtl"
                  className="text-right text-xl leading-loose text-foreground"
                  style={{ fontFamily: ARABIC_FONT_FAMILY }}
                >
                  {verse.arabic}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <Link
        href={localizeHref(
          buildSurahRoute(address.surahId, { startVerse: address.verseId }),
          locale
        )}
        className={`inline-flex min-h-touch items-center text-sm font-semibold ${linkClass}`}
      >
        {translator.t('verse_page_continue_reading')}
      </Link>
    </section>
  );
}

export default async function VersePage({ params }: VersePageProps): Promise<React.JSX.Element> {
  const resolved = await resolveVerse(params);
  const { address, verseKey, chapter, previous, next } = resolved;
  const locale = await getRequestUiLanguage();
  const { tafsirId } = getServerReaderDefaults(locale);

  // No waterfall: the range request already contains the verse itself.
  const [translator, { verse, context }, tafsir] = await Promise.all([
    getServerTranslator(locale),
    loadVerses(resolved, locale),
    getVersePageTafsirServer(verseKey, tafsirId),
  ]);

  const surahName = surahTitle(translator, chapter);
  const heading = translator.t('seo_verse_title_fallback', { surah: surahName, verseKey });
  const meaning = locale === 'en' ? chapter.translated_name?.name : undefined;
  const jsonLd = buildVerseJsonLd({ translator, chapter, address, heading, verse });

  return (
    <main
      data-slot="verse-page"
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-28 pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top)+1.5rem)] text-foreground sm:px-6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Breadcrumbs translator={translator} chapter={chapter} address={address} />

      <header className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">{heading}</h1>
        <p className="text-sm text-muted">
          <span lang="ar" dir="rtl">
            {chapter.name_arabic}
          </span>
          {meaning ? <span> · {meaning}</span> : null}
        </p>
        <VerseLocation translator={translator} verse={verse} />
      </header>

      {/* Mobile: one column in DOM order. Desktop: the context list becomes a side column spanning
          every row; the trailing `1fr` row absorbs its extra height so the main cards stay stacked. */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_auto_auto_auto_1fr] lg:items-start lg:gap-x-8">
        <VerseTextCard translator={translator} verse={verse} verseKey={verseKey} />

        <VerseContext
          translator={translator}
          address={address}
          verses={context}
          className="lg:sticky lg:top-[calc(var(--reader-header-height)+1rem)] lg:col-start-2 lg:row-span-5 lg:row-start-1"
        />

        <VerseTafsirExcerpt translator={translator} address={address} tafsir={tafsir} />

        <nav aria-label={translator.t('verse_page_navigation')} className="grid grid-cols-2 gap-3">
          <VerseNavLink
            target={previous}
            label={translator.t('verse_page_previous')}
            locale={locale}
            direction="previous"
          />
          <VerseNavLink
            target={next}
            label={translator.t('verse_page_next')}
            locale={locale}
            direction="next"
          />
        </nav>

        <Link
          href={localizeHref(
            buildSurahRoute(address.surahId, { startVerse: address.verseId }),
            locale
          )}
          className="flex min-h-touch items-center justify-center rounded-lg bg-accent px-4 py-3 font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {translator.t('verse_page_read_surah', { surah: surahName })}
        </Link>
      </div>
    </main>
  );
}
