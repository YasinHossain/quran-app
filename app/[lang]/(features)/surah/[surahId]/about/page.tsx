import { notFound } from 'next/navigation';

import {
  getPageUiLanguage,
  getServerReaderDefaults,
  getServerTranslator,
  type ServerTranslator,
} from '@/app/shared/i18n/serverLocale';
import { buildSurahAboutRoute, buildSurahRoute } from '@/app/shared/navigation/routes';
import { DEFAULT_RECITER } from '@/app/shared/player/defaultReciter';
import {
  getChaptersServer,
  getPrerenderedVersesServer,
  getSurahRecitationServer,
  getVersePageTafsirServer,
} from '@/lib/api/server';
import { buildLocalizedPageMetadata, localizedUrl } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';
import { buildSurahFacts, buildSurahSummary, type SurahFacts } from '@/lib/seo/surahFacts';
import { resolveSurahParam } from '@/lib/seo/surahSlugs';
import { buildSurahWordStats } from '@/lib/seo/surahStats';
import { buildTafsirIntro } from '@/lib/seo/tafsirIntro';
import { localizeDigits } from '@/lib/text/localizeNumbers';

import { SurahAboutView, type SurahTafsirIntro } from './components/SurahAboutView';

import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { Chapter } from '@/types';
import type { Metadata } from 'next';

// Rendered on first request per language, then cached for a day (ISR).
export const revalidate = 86400;

/** None at build time; defining it (even empty) makes the route ISR instead of per request. */
export function generateStaticParams(): Array<{ surahId: string }> {
  return [];
}

/** Tafsir Ibn Kathir in each language that has it on Quran.com; others (Hindi) get English. */
const IBN_KATHIR_TAFSIR_IDS: Partial<Record<UiLanguageCode, number>> = {
  en: 169,
  bn: 164,
  ar: 14,
  ur: 160,
};
const IBN_KATHIR_ENGLISH = 169;

/** Localized reciter name (`reciter_names.<id>`), else the default reciter's English name. */
function reciterName(translator: ServerTranslator, reciterId: number): string {
  const key = `reciter_names.${reciterId}`;
  const name = translator.t(key);
  return name === key ? DEFAULT_RECITER.name : name;
}

async function loadIbnKathir(tafsirId: number, verseKey: string, inEnglish: boolean) {
  const tafsir = await getVersePageTafsirServer(verseKey, tafsirId);
  const intro = buildTafsirIntro(tafsir?.html);
  return tafsir && intro
    ? { ...intro, name: tafsir.name, languageCode: tafsir.languageCode, inEnglish }
    : undefined;
}

/**
 * The opening of Ibn Kathir's commentary (its text for verse 1) in the page language. When that has
 * no usable text, the English edition; when that has none either, `undefined` and the page leaves
 * the section out (the hero still links to the full tafsir). A failed request throws, so the cached
 * (ISR) page is not stored without it.
 */
async function loadTafsirIntro(
  chapterId: number,
  locale: UiLanguageCode
): Promise<SurahTafsirIntro | undefined> {
  const verseKey = `${chapterId}:1`;
  const own = IBN_KATHIR_TAFSIR_IDS[locale];
  if (own) {
    const intro = await loadIbnKathir(own, verseKey, false);
    if (intro || own === IBN_KATHIR_ENGLISH) return intro;
  }
  return loadIbnKathir(IBN_KATHIR_ENGLISH, verseKey, locale !== 'en');
}

interface SurahAboutPageProps {
  params: Promise<{ lang: string; surahId: string }>;
}

interface ResolvedSurah {
  chapter: Chapter;
  previous: Chapter | undefined;
  next: Chapter | undefined;
}

/** The segment is the surah slug; `proxy.ts` redirects numbers, spellings and `/info`. */
async function resolveSurah(params: SurahAboutPageProps['params']): Promise<ResolvedSurah> {
  const { surahId } = await params;
  const surah = resolveSurahParam(surahId);
  if (!surah) notFound();
  const chapters = await getChaptersServer();
  const chapter = chapters.find((item) => item.id === surah.id);
  if (!chapter) notFound();
  return {
    chapter,
    previous: chapters.find((item) => item.id === surah.id - 1),
    next: chapters.find((item) => item.id === surah.id + 1),
  };
}

/** English names carry their meaning ("Al-Alaq (The Clot)"); other languages use the local name. */
function nameWithMeaning(translator: ServerTranslator, chapter: Chapter): string {
  const name = translator.chapterName(chapter);
  const meaning = chapter.translated_name?.name;
  return translator.locale === 'en' && meaning ? `${name} (${meaning})` : name;
}

function summaryFor(translator: ServerTranslator, chapter: Chapter, facts: SurahFacts): string[] {
  return buildSurahSummary({
    t: translator.t,
    facts,
    name: nameWithMeaning(translator, chapter),
    digits: (value) => localizeDigits(String(value), translator.locale),
  });
}

export async function generateMetadata({ params }: SurahAboutPageProps): Promise<Metadata> {
  const { chapter } = await resolveSurah(params);
  const locale = await getPageUiLanguage(params);
  const translator = await getServerTranslator(locale);
  const facts = buildSurahFacts(chapter);

  return buildLocalizedPageMetadata({
    path: buildSurahAboutRoute(chapter.id),
    locale,
    title: translator.t('seo_surah_about_title', {
      name: translator.chapterName(chapter),
      number: chapter.id,
    }),
    description: [
      ...summaryFor(translator, chapter, facts),
      translator.t('seo_surah_about_description_tail', { siteName: SITE_NAME }),
    ].join(' '),
  });
}

function buildJsonLd(input: {
  translator: ServerTranslator;
  chapter: Chapter;
  description: string;
}): Array<Record<string, unknown>> {
  const { translator, chapter, description } = input;
  const { locale } = translator;
  const name = translator.chapterName(chapter);
  const surahUrl = localizedUrl(buildSurahRoute(chapter.id), locale);
  const aboutUrl = localizedUrl(buildSurahAboutRoute(chapter.id), locale);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: SITE_NAME, item: localizedUrl('/', locale) },
        { name: translator.t('surah_tab'), item: localizedUrl('/surah', locale) },
        { name, item: surahUrl },
        { name: translator.t('surah_about_breadcrumb'), item: aboutUrl },
      ].map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: translator.t('surah_about_heading', { name }),
      url: aboutUrl,
      inLanguage: locale,
      description,
      about: {
        '@type': 'Chapter',
        name: translator.t('seo_surah_name', { name }),
        alternateName: chapter.name_arabic,
        url: surahUrl,
        position: chapter.id,
        isPartOf: { '@type': 'Book', name: 'The Holy Quran', url: localizedUrl('/', locale) },
      },
    },
  ];
}

export default async function SurahAboutPage({
  params,
}: SurahAboutPageProps): Promise<React.JSX.Element> {
  const { chapter, previous, next } = await resolveSurah(params);
  const locale: UiLanguageCode = await getPageUiLanguage(params);
  const { translationIds } = getServerReaderDefaults(locale);

  // Same request (and cache entry) as the surah page's full-text section.
  const [translator, verses, tafsirIntro, recitation] = await Promise.all([
    getServerTranslator(locale),
    getPrerenderedVersesServer({
      group: 'by_chapter',
      id: String(chapter.id),
      translationIds,
    }),
    loadTafsirIntro(chapter.id, locale),
    getSurahRecitationServer(DEFAULT_RECITER.id, chapter.id),
  ]);

  const facts = buildSurahFacts(chapter);
  const summary = summaryFor(translator, chapter, facts);
  const jsonLd = buildJsonLd({ translator, chapter, description: summary.join(' ') });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SurahAboutView
        translator={translator}
        chapter={chapter}
        facts={facts}
        summary={summary}
        wordStats={buildSurahWordStats(chapter.id)}
        tafsirIntro={tafsirIntro}
        recitation={
          recitation
            ? {
                ...recitation,
                reciterName: reciterName(translator, recitation.reciterId),
              }
            : undefined
        }
        firstVerse={verses?.[0]}
        lastVerse={verses && verses.length > 1 ? verses[verses.length - 1] : undefined}
        previous={previous}
        next={next}
      />
    </>
  );
}
