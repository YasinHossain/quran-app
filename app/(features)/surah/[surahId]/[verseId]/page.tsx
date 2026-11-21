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
import { ArrowLeftIcon } from '@/app/shared/icons';
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

import { VerseContextPanel } from './components/VerseContextPanel';
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
/** Quran text styling shared by the verse card and the context list. */
const ARABIC_TEXT_CLASS = 'text-right text-3xl leading-[2.2] text-foreground';
/** One step smaller in the narrow "Read in context" column. */
const CONTEXT_ARABIC_TEXT_CLASS = 'text-right text-2xl leading-[2.1] text-foreground';

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
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <Link
              href={crumb.href}
              prefetch={false}
              className="rounded-sm underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {crumb.label}
            </Link>
            <span aria-hidden="true" className="opacity-50">
              /
            </span>
          </li>
        ))}
        <li aria-current="page" className="font-medium text-foreground">
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
  readSurah,
}: {
  translator: ServerTranslator;
  verse: VersePageVerse;
  verseKey: string;
  readSurah: { href: string; label: string };
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
        className={ARABIC_TEXT_CLASS}
        style={{ fontFamily: ARABIC_FONT_FAMILY }}
      >
        {verse.arabic}
      </p>
      {verse.translations.map((translation) => (
        <figure key={translation.resourceId} className="space-y-2" data-slot="verse-translation">
          {translation.resourceName ? (
            <figcaption className="text-xs font-medium uppercase tracking-wide text-muted">
              {translation.resourceName}
            </figcaption>
          ) : null}
          <p
            lang={translation.languageCode ?? translator.locale}
            dir="auto"
            className="text-lg leading-relaxed text-foreground"
            dangerouslySetInnerHTML={{ __html: translation.html }}
          />
        </figure>
      ))}
      <div className="-mt-3 flex justify-end">
        <Link
          href={readSurah.href}
          data-slot="verse-read-surah"
          className="inline-flex items-center gap-1.5 rounded-sm py-2 text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {readSurah.label}
          <ArrowLeftIcon size={14} aria-hidden="true" className="rotate-180 rtl:rotate-0" />
        </Link>
      </div>
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

/** One compact row under the H1: Arabic name (and English meaning), mushaf page and juz. The
 * mushaf page route is not indexable, so only the juz is a link. */
function VerseMeta({
  translator,
  chapter,
  verse,
}: {
  translator: ServerTranslator;
  chapter: Chapter;
  verse: VersePageVerse;
}): React.JSX.Element {
  const { pageNumber, juzNumber } = verse;
  const meaning = translator.locale === 'en' ? chapter.translated_name?.name : undefined;
  return (
    <ul
      className="flex flex-wrap items-center gap-x-2 text-sm text-muted [&>li+li]:before:me-2 [&>li+li]:before:opacity-50 [&>li+li]:before:content-['·']"
      data-slot="verse-meta"
    >
      {/* The Arabic heading already names the surah in Arabic. */}
      {translator.locale === 'ar' ? null : (
        <li>
          <span lang="ar" dir="rtl" className="text-foreground">
            {chapter.name_arabic}
          </span>
          {meaning ? <span className="ms-1.5">({meaning})</span> : null}
        </li>
      )}
      {pageNumber ? (
        <li data-slot="verse-location">{`${translator.t('page')} ${pageNumber}`}</li>
      ) : null}
      {juzNumber ? (
        <li>
          <Link
            href={localizeHref(buildJuzRoute(juzNumber), translator.locale)}
            className="rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {translator.t('juz_number', { number: juzNumber })}
          </Link>
        </li>
      ) : null}
    </ul>
  );
}

/** Neighbouring verses (same surah) with the current one highlighted. Each verse carries both its
 * translation and its Arabic text; the panel's switch only changes which one is visible. */
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
  const hasTranslation = verses.some((verse) => verse.translations.length > 0);

  return (
    <VerseContextPanel
      headingId="verse-context-heading"
      heading={translator.t('verse_page_context_heading')}
      listLabel={translator.t('verse_page_context_verses')}
      {...(hasTranslation
        ? {
            viewLabels: {
              group: translator.t('verse_page_context_view'),
              translation: translator.t('verse_page_context_translation'),
              arabic: translator.t('verse_page_context_arabic'),
              both: translator.t('verse_page_context_both'),
            },
          }
        : {})}
      {...(className ? { className } : {})}
      footer={
        <Link
          href={localizeHref(
            buildSurahRoute(address.surahId, { startVerse: address.verseId }),
            locale
          )}
          className={`inline-flex min-h-touch items-center self-start text-sm font-semibold ${linkClass}`}
        >
          {translator.t('verse_page_continue_reading')}
        </Link>
      }
    >
      <ol className="space-y-2 py-1">
        {verses.map((verse) => {
          const isCurrent = verse.verseKey === currentKey;
          const [surahId = '', verseId = ''] = verse.verseKey.split(':');
          const translation = verse.translations[0];
          return (
            <li
              key={verse.verseKey}
              data-context-verse-key={verse.verseKey}
              {...(isCurrent ? { 'aria-current': 'true' as const } : {})}
              className={`space-y-2 rounded-md p-3 ${isCurrent ? 'border-s-2 border-accent bg-accent/10' : ''}`}
            >
              <Link
                href={localizeHref(buildVerseRoute(surahId, verseId), locale)}
                prefetch={false}
                className={`text-xs font-semibold ${linkClass}`}
              >
                {verse.verseKey}
              </Link>
              <p
                lang="ar"
                dir="rtl"
                data-slot="context-arabic"
                className={
                  translation
                    ? `hidden group-data-[context-view=arabic]/context:block group-data-[context-view=both]/context:block ${CONTEXT_ARABIC_TEXT_CLASS}`
                    : CONTEXT_ARABIC_TEXT_CLASS
                }
                style={{ fontFamily: ARABIC_FONT_FAMILY }}
              >
                {verse.arabic}
              </p>
              {translation ? (
                <p
                  lang={translation.languageCode ?? locale}
                  dir="auto"
                  data-slot="context-translation"
                  className="text-sm leading-relaxed text-foreground group-data-[context-view=arabic]/context:hidden"
                  dangerouslySetInnerHTML={{ __html: translation.html }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </VerseContextPanel>
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
  const readSurah = {
    href: localizeHref(buildSurahRoute(address.surahId, { startVerse: address.verseId }), locale),
    label: translator.t('verse_page_read_surah', { surah: surahName }),
  };
  const jsonLd = buildVerseJsonLd({ translator, chapter, address, heading, verse });

  return (
    <main
      data-slot="verse-page"
      className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 lg:max-w-7xl xl:max-w-[84rem] pb-28 pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top)+1rem)] text-foreground sm:px-6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="flex flex-col gap-1.5">
        <Breadcrumbs translator={translator} chapter={chapter} address={address} />
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-xl font-bold sm:text-2xl">{heading}</h1>
          <VerseMeta translator={translator} chapter={chapter} verse={verse} />
        </div>
      </header>

      {/* Mobile: one column in DOM order. Desktop: the context list becomes a side column spanning
          every row; the trailing `1fr` row absorbs its extra height so the main cards stay stacked. */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)] lg:grid-rows-[auto_auto_auto_1fr] lg:items-start lg:gap-x-8">
        <VerseTextCard
          translator={translator}
          verse={verse}
          verseKey={verseKey}
          readSurah={readSurah}
        />

        <VerseContext
          translator={translator}
          address={address}
          verses={context}
          className="lg:sticky lg:top-[calc(var(--reader-header-height)+var(--reader-safe-area-top)+1rem)] lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:max-h-[calc(100dvh-var(--reader-header-height)-var(--reader-safe-area-top)-2rem)]"
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
      </div>
    </main>
  );
}
