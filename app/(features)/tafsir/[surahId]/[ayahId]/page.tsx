import {
  getRequestUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  getTafsirMetadataTemplates,
} from '@/app/shared/i18n/serverLocale';
import { getChapterServer, getTafsirVersePageDataServer } from '@/lib/api/server';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { buildTafsirMetadataText } from '@/lib/seo/tafsirMetadata';

import TafsirVersePageClient from './components/TafsirVersePageClient';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Metadata } from 'next';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

/** Same arguments for metadata and page body, so the cached server fetches are shared. */
const getPageData = (verseKey: string, locale: UiLanguageCode) => {
  const { translationIds, wordLang, tafsirId } = getServerReaderDefaults(locale);
  return getTafsirVersePageDataServer({
    verseKey,
    tafsirId,
    translationIds,
    wordLang,
    tajweed: false,
  });
};

export async function generateMetadata({ params }: TafsirVersePageProps): Promise<Metadata> {
  const { surahId: rawSurahId, ayahId: rawAyahId } = await params;
  const surahId = Number.parseInt(String(rawSurahId), 10);
  const ayahId = Number.parseInt(String(rawAyahId), 10);

  const path = `/tafsir/${encodeURIComponent(rawSurahId)}/${encodeURIComponent(rawAyahId)}`;
  const verseKey =
    Number.isFinite(surahId) && Number.isFinite(ayahId)
      ? `${surahId}:${ayahId}`
      : `${rawSurahId}:${rawAyahId}`;

  const locale = await getRequestUiLanguage();
  const { translationIds } = getServerReaderDefaults(locale);
  const [translator, chapter, pageData] = await Promise.all([
    getServerTranslator(locale),
    Number.isFinite(surahId)
      ? getChapterServer(surahId).catch(() => undefined)
      : Promise.resolve(undefined),
    getPageData(verseKey, locale).catch(() => undefined),
  ]);
  const chapterName = chapter
    ? translator.chapterName(chapter)
    : translator.t('seo_surah_name', { name: rawSurahId });

  const translations = pageData?.verse.translations;
  const translationText = translationIds.length
    ? (translations?.find((t) => t.resource_id === translationIds[0])?.text ??
      translations?.[0]?.text)
    : // Arabic UI renders no translation; the verse itself leads the snippet.
      pageData?.verse.text_uthmani;

  const { title, description } = buildTafsirMetadataText({
    chapterName,
    verseKey,
    translationText,
    templates: getTafsirMetadataTemplates(translator),
  });

  return buildLocalizedPageMetadata({ path, locale, title, description });
}

export default async function TafsirVersePage({
  params,
}: TafsirVersePageProps): Promise<React.JSX.Element> {
  const { surahId, ayahId } = await params;
  const verseKey = `${surahId}:${ayahId}`;
  const locale = await getRequestUiLanguage();

  const { verse, tafsirHtml, tafsirResource } = await getPageData(verseKey, locale);

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
