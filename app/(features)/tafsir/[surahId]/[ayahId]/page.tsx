import { getTafsirVersePageDataServer } from '@/lib/api/server';
import { getChapterServer } from '@/lib/api/server';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';
import { buildTafsirMetadataText } from '@/lib/seo/tafsirMetadata';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import TafsirVersePageClient from './components/TafsirVersePageClient';

import type { Metadata } from 'next';

const DEFAULT_TRANSLATION_IDS = [20];
const DEFAULT_WORD_LANG = ensureLanguageCode('en');
const DEFAULT_TAFSIR_ID = 169;

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

export async function generateMetadata({ params }: TafsirVersePageProps): Promise<Metadata> {
  const { surahId: rawSurahId, ayahId: rawAyahId } = await params;
  const surahId = Number.parseInt(String(rawSurahId), 10);
  const ayahId = Number.parseInt(String(rawAyahId), 10);

  const canonicalPath = `/tafsir/${encodeURIComponent(rawSurahId)}/${encodeURIComponent(rawAyahId)}`;
  const verseKey =
    Number.isFinite(surahId) && Number.isFinite(ayahId)
      ? `${surahId}:${ayahId}`
      : `${rawSurahId}:${rawAyahId}`;

  const chapter = Number.isFinite(surahId)
    ? await getChapterServer(surahId).catch(() => undefined)
    : undefined;
  const chapterName = chapter?.name_simple || `Surah ${rawSurahId}`;

  // Same arguments as the page body, so the cached server fetches are shared.
  const pageData = await getTafsirVersePageDataServer({
    verseKey,
    tafsirId: DEFAULT_TAFSIR_ID,
    translationIds: DEFAULT_TRANSLATION_IDS,
    wordLang: DEFAULT_WORD_LANG,
    tajweed: false,
  }).catch(() => undefined);
  const translationText = pageData?.verse.translations?.find(
    (t) => t.resource_id === DEFAULT_TRANSLATION_IDS[0]
  )?.text;

  const { title, description } = buildTafsirMetadataText({
    chapterName,
    verseKey,
    translationText: translationText ?? pageData?.verse.translations?.[0]?.text,
  });

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

export default async function TafsirVersePage({
  params,
}: TafsirVersePageProps): Promise<React.JSX.Element> {
  const { surahId, ayahId } = await params;
  const verseKey = `${surahId}:${ayahId}`;

  const { verse, tafsirHtml, tafsirResource } = await getTafsirVersePageDataServer({
    verseKey,
    tafsirId: DEFAULT_TAFSIR_ID,
    translationIds: DEFAULT_TRANSLATION_IDS,
    wordLang: DEFAULT_WORD_LANG,
    tajweed: false,
  });

  return (
    <TafsirVersePageClient
      surahId={surahId}
      ayahId={ayahId}
      initialVerse={verse}
      initialTafsirHtml={tafsirHtml}
      initialTafsirResource={tafsirResource}
    />
  );
}
