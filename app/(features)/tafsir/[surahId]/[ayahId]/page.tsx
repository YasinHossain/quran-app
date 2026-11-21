import { notFound } from 'next/navigation';

import { TAFSIR_LANGUAGES } from '@/app/shared/i18n/languageRegistry';
import {
  getRequestUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  getTafsirMetadataTemplates,
} from '@/app/shared/i18n/serverLocale';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { parseVerseAddress } from '@/app/shared/navigation/verseNavigation';
import { getChaptersServer, getTafsirVersePageDataServer, toVerseCounts } from '@/lib/api/server';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { resolveSurahParam } from '@/lib/seo/surahSlugs';
import { buildTafsirMetadataText } from '@/lib/seo/tafsirMetadata';

import TafsirVersePageClient from './components/TafsirVersePageClient';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Metadata } from 'next';

interface TafsirVersePageProps {
  params: Promise<{ surahId: string; ayahId: string }>;
}

/**
 * The surah segment is the slug (`al-baqarah`); unknown surahs and verses that do not exist
 * (`/tafsir/al-baqarah/999`, `/tafsir/al-baqarah/abc`) 404, validated like the verse page.
 */
async function resolveTafsirParams(params: TafsirVersePageProps['params']): Promise<{
  surahId: number;
  ayahId: number;
  chapter: Awaited<ReturnType<typeof getChaptersServer>>[number];
}> {
  const { surahId, ayahId } = await params;
  const surah = resolveSurahParam(surahId);
  if (!surah) notFound();
  const chapters = await getChaptersServer();
  const address = parseVerseAddress(String(surah.id), ayahId, toVerseCounts(chapters));
  const chapter = address && chapters.find((c) => c.id === address.surahId);
  if (!address || !chapter) notFound();
  return { surahId: address.surahId, ayahId: address.verseId, chapter };
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
  const { surahId, ayahId, chapter } = await resolveTafsirParams(params);
  const path = buildTafsirRoute(surahId, ayahId);
  const verseKey = `${surahId}:${ayahId}`;

  const locale = await getRequestUiLanguage();
  const { translationIds } = getServerReaderDefaults(locale);
  const [translator, pageData] = await Promise.all([
    getServerTranslator(locale),
    getPageData(verseKey, locale).catch(() => undefined),
  ]);
  const chapterName = translator.chapterName(chapter);

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

  // Languages without their own tafsir (Hindi) serve another language's text: noindex, and not
  // an hreflang alternate.
  return buildLocalizedPageMetadata({
    path,
    locale,
    title,
    description,
    languages: TAFSIR_LANGUAGES,
  });
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
      ayahId={String(ayahId)}
      initialVerse={verse}
      initialTafsirHtml={tafsirHtml}
      initialTafsirResource={tafsirResource}
    />
  );
}
