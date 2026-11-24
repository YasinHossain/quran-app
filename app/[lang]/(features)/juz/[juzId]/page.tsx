import { notFound } from 'next/navigation';

import {
  getFullTextTitleTemplates,
  getPageUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  type ServerTranslator,
} from '@/app/shared/i18n/serverLocale';
import { getUiLanguageDirection } from '@/app/shared/i18n/uiLanguages';
import { JuzSurahList } from '@/app/shared/reader/JuzSurahList';
import { ReaderFullText, buildFullTextTitle } from '@/app/shared/reader/ReaderFullText';
import { ReaderServerDataProvider } from '@/app/shared/reader/ReaderServerData';
import { getJuzInitialDataServer, getPrerenderedVersesServer } from '@/lib/api/server';
import { buildJuzTitle, findJuzById as findJuz } from '@/lib/seo/juzSurahs';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';

import { JuzClient } from './JuzClient';

import type { JuzSummary } from '@/app/shared/navigation/types';
import type { Metadata } from 'next';

// Quran content does not change: cache each page for a day (ISR).
export const revalidate = 86400;

/** None at build time: each juz page renders on its first request and is then cached (ISR). */
export function generateStaticParams(): Array<{ juzId: string }> {
  return [];
}

/** "An-Naba 1 - An-Naas 6" in the page language (English keeps the dataset wording). */
function buildSurahRange(translator: ServerTranslator, juz: JuzSummary): string {
  if (translator.locale === 'en' || !juz.startSurahId || !juz.endSurahId) return juz.surahRange;
  return `${translator.surahName(juz.startSurahId)} ${juz.startAyah ?? 1} - ${translator.surahName(
    juz.endSurahId
  )} ${juz.endAyah ?? ''}`.trim();
}

function buildJuzDescription(
  translator: ServerTranslator,
  juzId: string,
  juz: JuzSummary | undefined
): string {
  if (!juz) {
    return translator.t('seo_juz_description_fallback', { number: juzId, siteName: SITE_NAME });
  }

  return translator.t('seo_juz_description', {
    number: juzId,
    range: buildSurahRange(translator, juz),
    siteName: SITE_NAME,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; juzId: string }>;
}): Promise<Metadata> {
  const { juzId } = await params;
  const locale = await getPageUiLanguage(params);
  const translator = await getServerTranslator(locale);
  const juz = findJuz(juzId);
  if (!juz) notFound();

  return buildLocalizedPageMetadata({
    path: `/juz/${encodeURIComponent(juzId)}`,
    locale,
    title: buildJuzTitle(translator, juzId, juz),
    description: buildJuzDescription(translator, juzId, juz),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; juzId: string }>;
}): Promise<React.JSX.Element> {
  const { juzId } = await params;
  // Render exactly what the client reader starts with for this language (see surah page).
  const locale = await getPageUiLanguage(params);
  const { translationIds, wordLang } = getServerReaderDefaults(locale);
  // Matches the client reader's API page size (VERSES_PER_PAGE) so the SSR page is reused as page 1.
  const INITIAL_VERSES_PER_PAGE = 10;
  const numericJuzId = Number.parseInt(juzId, 10);
  const juz = findJuz(juzId);
  if (!juz) notFound();
  const isValidJuzId = Number.isFinite(numericJuzId) && numericJuzId >= 1 && numericJuzId <= 30;
  const [translator, initialData, prerenderedVerses] = await Promise.all([
    getServerTranslator(locale),
    getJuzInitialDataServer({
      juzId,
      translationIds,
      wordLang,
      perPage: INITIAL_VERSES_PER_PAGE,
    }),
    // Text of every verse for the full-text section; the interactive list is virtualized.
    isValidJuzId
      ? getPrerenderedVersesServer({
          group: 'by_juz',
          id: String(numericJuzId),
          translationIds,
        })
      : Promise.resolve(undefined),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <ReaderServerDataProvider
        intro={
          juz ? (
            <JuzSurahList
              juz={juz}
              translator={translator}
              locale={locale}
              dir={getUiLanguageDirection(locale)}
            />
          ) : null
        }
        fullText={
          prerenderedVerses?.length ? (
            <ReaderFullText
              title={buildFullTextTitle(
                translator.t('juz_number', { number: numericJuzId }),
                prerenderedVerses,
                getFullTextTitleTemplates(translator)
              )}
              verses={prerenderedVerses}
              lang={locale}
              dir={getUiLanguageDirection(locale)}
              locale={locale}
            />
          ) : null
        }
      >
        <JuzClient
          juzId={juzId}
          {...(initialData.initialVerses ? { initialVerses: initialData.initialVerses } : {})}
          {...(typeof initialData.totalVerses === 'number'
            ? { totalVerses: initialData.totalVerses }
            : {})}
          initialVersesParams={{ translationIds, wordLang }}
        />
      </ReaderServerDataProvider>
    </div>
  );
}
