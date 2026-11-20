import { SurahView } from '@/app/(features)/surah/components';
import {
  getFullTextTitleTemplates,
  getRequestUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  type ServerTranslator,
} from '@/app/shared/i18n/serverLocale';
import { getUiLanguageDirection } from '@/app/shared/i18n/uiLanguages';
import { ReaderFullText, buildFullTextTitle } from '@/app/shared/reader/ReaderFullText';
import { ReaderServerDataProvider } from '@/app/shared/reader/ReaderServerData';
import {
  getChapterServer,
  getPrerenderedVersesServer,
  getSurahInitialDataServer,
} from '@/lib/api/server';
import { buildLocalizedPageMetadata, localizedUrl } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Chapter } from '@/types';
import type { Metadata } from 'next';

// Cache this page for 1 hour - makes subsequent visits instant
// Translation changes are handled client-side by SWR
export const revalidate = 3600;

export async function generateStaticParams(): Promise<Array<{ surahId: string }>> {
  // Pre-render all 114 surahs at build time for faster Googlebot crawling
  return Array.from({ length: 114 }, (_, i) => ({ surahId: String(i + 1) }));
}

interface SurahPageProps {
  params: Promise<{ surahId: string }>;
}

/** Name for descriptions; English adds the (English) meaning, e.g. "Ya-Sin (Ya Sin)". */
function surahDisplayName(
  translator: ServerTranslator,
  chapter: Chapter | undefined,
  rawId: string
): string {
  if (!chapter) return rawId;
  const name = translator.chapterName(chapter);
  const meaning = chapter.translated_name?.name;
  return translator.locale === 'en' && meaning ? `${name} (${meaning})` : name;
}

/**
 * Build a rich, keyword-bearing meta description from chapter data.
 */
function buildSurahDescription(
  translator: ServerTranslator,
  chapter: Chapter | undefined,
  rawId: string,
  surahId: number
): string {
  if (!chapter) {
    return translator.t('seo_surah_description_fallback', { number: rawId, siteName: SITE_NAME });
  }

  const key =
    chapter.revelation_place === 'makkah'
      ? 'seo_surah_description_makkah'
      : 'seo_surah_description_madinah';
  return translator.t(key, {
    name: surahDisplayName(translator, chapter, rawId),
    number: surahId,
    count: chapter.verses_count,
    siteName: SITE_NAME,
  });
}

/**
 * Build JSON-LD structured data for a surah page:
 * - BreadcrumbList: enables breadcrumb display in search results
 * - Chapter: helps Google understand the content hierarchy
 */
function buildSurahJsonLd(
  translator: ServerTranslator,
  chapter: Chapter | undefined,
  rawId: string,
  surahId: number
): Array<Record<string, unknown>> {
  const { locale } = translator;
  const chapterName = chapter ? translator.chapterName(chapter) : rawId;
  const canonicalUrl = localizedUrl(`/surah/${Number.isFinite(surahId) ? surahId : rawId}`, locale);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: localizedUrl('/', locale),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: translator.t('surah_tab'),
        item: localizedUrl('/surah', locale),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: chapterName,
        item: canonicalUrl,
      },
    ],
  };

  const chapterSchema = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: translator.t('seo_surah_name', { name: chapterName }),
    url: canonicalUrl,
    inLanguage: locale,
    isPartOf: {
      '@type': 'Book',
      name: 'The Holy Quran',
      url: localizedUrl('/', locale),
    },
    position: Number.isFinite(surahId) ? surahId : undefined,
    ...(chapter?.verses_count ? { numberOfPages: chapter.verses_count } : {}),
    description: buildSurahDescription(translator, chapter, rawId, surahId),
  };

  return [breadcrumb, chapterSchema];
}

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawId = resolvedParams.surahId;
  const surahId = Number.parseInt(String(rawId), 10);
  const path = Number.isFinite(surahId)
    ? `/surah/${surahId}`
    : `/surah/${encodeURIComponent(rawId)}`;

  const locale = await getRequestUiLanguage();
  const [translator, chapter] = await Promise.all([
    getServerTranslator(locale),
    Number.isFinite(surahId)
      ? getChapterServer(surahId).catch(() => undefined)
      : Promise.resolve(undefined),
  ]);
  const title = chapter
    ? translator.t('seo_surah_title', {
        name: translator.chapterName(chapter),
        number: surahId,
      })
    : translator.t('seo_surah_name', { name: rawId });

  return buildLocalizedPageMetadata({
    path,
    locale,
    title,
    description: buildSurahDescription(translator, chapter, rawId, surahId),
  });
}

/**
 * Surah page component for displaying a specific Surah.
 * Server component that handles async params and renders the SurahView.
 */
async function SurahPage({ params }: SurahPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await params;
  const rawId = resolvedParams.surahId;
  const surahId = Number.parseInt(String(rawId), 10);

  // Render exactly what the client reader starts with for this language, so the server page is
  // reused as page 1 after hydration (no refetch, no flash of a different translation).
  const locale: UiLanguageCode = await getRequestUiLanguage();
  const { translationIds, wordLang } = getServerReaderDefaults(locale);
  // Matches the client reader's API page size (VERSES_PER_PAGE) so the SSR page is reused as page 1.
  const INITIAL_VERSES_PER_PAGE = 10;

  const [translator, initialData, chapter, prerenderedVerses] = await Promise.all([
    getServerTranslator(locale),
    getSurahInitialDataServer({
      surahId: resolvedParams.surahId,
      translationIds,
      wordLang,
      perPage: INITIAL_VERSES_PER_PAGE,
    }),
    Number.isFinite(surahId)
      ? getChapterServer(surahId).catch(() => undefined)
      : Promise.resolve(undefined),
    // Text of every verse for the full-text section; the interactive list is virtualized.
    Number.isFinite(surahId)
      ? getPrerenderedVersesServer({
          group: 'by_chapter',
          id: String(surahId),
          translationIds,
        })
      : Promise.resolve(undefined),
  ]);

  const { totalVerses, initialVerses } = initialData;

  const jsonLd = buildSurahJsonLd(translator, chapter, rawId, surahId);
  const fullTextSubject = translator.t('seo_surah_name', {
    name: chapter ? translator.chapterName(chapter) : rawId,
  });

  const surahViewProps = {
    ...(typeof totalVerses === 'number' ? { totalVerses } : {}),
    ...(initialVerses ? { initialVerses } : {}),
    initialVersesParams: { translationIds, wordLang },
  } satisfies Record<string, unknown>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReaderServerDataProvider
        chapter={
          chapter
            ? {
                id: chapter.id,
                name_simple: chapter.name_simple,
                verses_count: chapter.verses_count,
                revelation_place: chapter.revelation_place,
              }
            : undefined
        }
        fullText={
          prerenderedVerses?.length ? (
            <ReaderFullText
              title={buildFullTextTitle(
                fullTextSubject,
                prerenderedVerses,
                getFullTextTitleTemplates(translator)
              )}
              verses={prerenderedVerses}
              lang={locale}
              dir={getUiLanguageDirection(locale)}
            />
          ) : null
        }
      >
        <SurahView surahId={resolvedParams.surahId} {...surahViewProps} />
      </ReaderServerDataProvider>
    </>
  );
}

export default SurahPage;
