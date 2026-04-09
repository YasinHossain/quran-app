import { getAllJuzs } from '@/app/shared/navigation/datasets';
import { getJuzInitialDataServer } from '@/lib/api/server';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import { JuzClient } from './JuzClient';

import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateStaticParams(): Promise<Array<{ juzId: string }>> {
  return Array.from({ length: 30 }, (_, index) => ({ juzId: String(index + 1) }));
}

function buildJuzDescription(juzId: string, surahRange?: string): string {
  if (!surahRange) {
    return `Read Quran by Juz ${juzId} on ${SITE_NAME}.`;
  }

  return `Read Juz ${juzId} of the Holy Quran, covering ${surahRange}, with Arabic text, translations, and audio on ${SITE_NAME}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ juzId: string }>;
}): Promise<Metadata> {
  const { juzId } = await params;
  const numericJuzId = Number.parseInt(juzId, 10);
  const canonicalPath = `/juz/${encodeURIComponent(juzId)}`;
  const juzSummary = Number.isFinite(numericJuzId)
    ? getAllJuzs().find((juz) => juz.number === numericJuzId)
    : undefined;
  const description = buildJuzDescription(juzId, juzSummary?.surahRange);
  const title = juzSummary?.name ?? `Juz ${juzId}`;

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

export default async function Page({
  params,
}: {
  params: Promise<{ juzId: string }>;
}): Promise<React.JSX.Element> {
  const { juzId } = await params;
  const DEFAULT_TRANSLATION_IDS = [20];
  const DEFAULT_WORD_LANG = ensureLanguageCode('en');
  const INITIAL_VERSES_PER_PAGE = 20;
  const initialData = await getJuzInitialDataServer({
    juzId,
    translationIds: DEFAULT_TRANSLATION_IDS,
    wordLang: DEFAULT_WORD_LANG,
    perPage: INITIAL_VERSES_PER_PAGE,
  });

  return (
    <div className="min-h-screen bg-background">
      <JuzClient
        juzId={juzId}
        {...(initialData.initialVerses ? { initialVerses: initialData.initialVerses } : {})}
        {...(typeof initialData.totalVerses === 'number'
          ? { totalVerses: initialData.totalVerses }
          : {})}
        initialVersesParams={{
          translationIds: DEFAULT_TRANSLATION_IDS,
          wordLang: DEFAULT_WORD_LANG,
        }}
      />
    </div>
  );
}
