import { SurahView } from '@/app/(features)/surah/components';
import { getSurahInitialDataServer } from '@/lib/api/server';
import { getChapterServer } from '@/lib/api/server';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

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

/**
 * Build a rich, keyword-bearing meta description from chapter data.
 */
function buildSurahDescription(
  chapter: Chapter | undefined,
  rawId: string,
  surahId: number
): string {
  if (!chapter) {
    return `Read Surah ${rawId} from the Holy Quran with translations, tafsir, and audio recitation on ${SITE_NAME}.`;
  }

  const chapterName = chapter.name_simple;
  const translatedName = chapter.translated_name?.name;
  const nameStr = translatedName ? `${chapterName} (${translatedName})` : chapterName;
  const revelationType = chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan';

  return `Read Surah ${nameStr} — Chapter ${surahId} of the Holy Quran. ${revelationType} surah with ${chapter.verses_count} verses. Listen to audio recitation, read translations, and explore tafsir on ${SITE_NAME}.`;
}

/**
 * Build JSON-LD structured data for a surah page:
 * - BreadcrumbList: enables breadcrumb display in search results
 * - Chapter: helps Google understand the content hierarchy
 */
function buildSurahJsonLd(
  chapter: Chapter | undefined,
  rawId: string,
  surahId: number
): Array<Record<string, unknown>> {
  const chapterName = chapter?.name_simple || `Surah ${rawId}`;
  const canonicalUrl = absoluteUrl(`/surah/${Number.isFinite(surahId) ? surahId : rawId}`);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Surah',
        item: absoluteUrl('/surah'),
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
    name: `Surah ${chapterName}`,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'Book',
      name: 'The Holy Quran',
      url: absoluteUrl('/'),
    },
    position: Number.isFinite(surahId) ? surahId : undefined,
    ...(chapter?.verses_count ? { numberOfPages: chapter.verses_count } : {}),
    description: buildSurahDescription(chapter, rawId, surahId),
  };

  return [breadcrumb, chapterSchema];
}

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawId = resolvedParams.surahId;
  const surahId = Number.parseInt(String(rawId), 10);
  const canonicalPath = Number.isFinite(surahId)
    ? `/surah/${surahId}`
    : `/surah/${encodeURIComponent(rawId)}`;

  const chapter = Number.isFinite(surahId)
    ? await getChapterServer(surahId).catch(() => undefined)
    : undefined;
  const chapterName = chapter?.name_simple || `Surah ${rawId}`;
  const title = chapter ? `Surah ${chapterName} (${surahId})` : chapterName;
  const description = buildSurahDescription(chapter, rawId, surahId);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(canonicalPath),
    },
    twitter: {
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

/**
 * Surah page component for displaying a specific Surah.
 * Server component that handles async params and renders the SurahView.
 */
async function SurahPage({ params }: SurahPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await params;
  const rawId = resolvedParams.surahId;
  const surahId = Number.parseInt(String(rawId), 10);

  const DEFAULT_INITIAL_TRANSLATION_IDS = [20];
  const DEFAULT_INITIAL_WORD_LANG = 'en';
  const INITIAL_VERSES_PER_PAGE = 20;

  const language = ensureLanguageCode(DEFAULT_INITIAL_WORD_LANG);

  const [initialData, chapter] = await Promise.all([
    getSurahInitialDataServer({
      surahId: resolvedParams.surahId,
      translationIds: DEFAULT_INITIAL_TRANSLATION_IDS,
      wordLang: language,
      perPage: INITIAL_VERSES_PER_PAGE,
    }),
    Number.isFinite(surahId)
      ? getChapterServer(surahId).catch(() => undefined)
      : Promise.resolve(undefined),
  ]);

  const { totalVerses, initialVerses } = initialData;

  const jsonLd = buildSurahJsonLd(chapter, rawId, surahId);

  const surahViewProps = {
    ...(typeof totalVerses === 'number' ? { totalVerses } : {}),
    ...(initialVerses ? { initialVerses } : {}),
    initialVersesParams: {
      translationIds: DEFAULT_INITIAL_TRANSLATION_IDS,
      wordLang: language,
    },
  } satisfies Record<string, unknown>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SurahView surahId={resolvedParams.surahId} {...surahViewProps} />
    </>
  );
}

export default SurahPage;
