import { notFound } from 'next/navigation';

import {
  getRequestUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  getTafsirMetadataTemplates,
} from '@/app/shared/i18n/serverLocale';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { getChapterServer, getTafsirVersePageDataServer } from '@/lib/api/server';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { resolveSurahParam } from '@/lib/seo/surahSlugs';
import { buildTafsirMetadataText } from '@/lib/seo/tafsirMetadata';

import TafsirVersePageClient from './components/TafsirVersePageClient';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Metadata } from 'next';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

/** The surah segment is the slug (`al-baqarah`); unknown surahs 404. */
async function resolveTafsirParams(
  params: TafsirVersePageProps['params']
): Promise<{ surahId: number; ayahId: string }> {
  const { surahId, ayahId } = await params;
  const surah = resolveSurahParam(surahId);
  if (!surah) notFound();
  return { surahId: surah.id, ayahId };
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
  const { surahId, ayahId: rawAyahId } = await resolveTafsirParams(params);
  const ayahId = Number.parseInt(String(rawAyahId), 10);

  const path = buildTafsirRoute(surahId, Number.isFinite(ayahId) ? ayahId : rawAyahId);
  const verseKey = Number.isFinite(ayahId) ? `${surahId}:${ayahId}` : `${surahId}:${rawAyahId}`;

  const locale = await getRequestUiLanguage();
  const { translationIds } = getServerReaderDefaults(locale);
  const [translator, chapter, pageData] = await Promise.all([
    getServerTranslator(locale),
    getChapterServer(surahId).catch(() => undefined),
    getPageData(verseKey, locale).catch(() => undefined),
  ]);
  const chapterName = chapter
    ? translator.chapterName(chapter)
    : translator.t('seo_surah_name', { name: String(surahId) });

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
  const { surahId, ayahId } = await resolveTafsirParams(params);
  const verseKey = `${surahId}:${ayahId}`;
  const locale = await getRequestUiLanguage();

  const { verse, tafsirHtml, tafsirResource } = await getPageData(verseKey, locale);

  return (
    <TafsirVersePageClient
      surahId={String(surahId)}
      ayahId={ayahId}
      initialVerse={verse}
      initialTafsirHtml={tafsirHtml}
      initialTafsirResource={tafsirResource}
    />
  );
}
