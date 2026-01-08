import { SurahView } from '@/app/(features)/surah/components';
import { getVersesByChapter } from '@/lib/api';
import { getChapter } from '@/lib/api/chapters';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { Verse } from '@/types';

// Cache this page for 1 hour - makes subsequent visits instant
// Translation changes are handled client-side by SWR
export const revalidate = 3600;

interface SurahPageProps {
  params: Promise<{ surahId: string }>;
  searchParams?:
  | Promise<{
    startVerse?: string;
  }>
  | {
    startVerse?: string;
  };
}

/**
 * Surah page component for displaying a specific Surah.
 * Server component that handles async params and renders the SurahView.
 */
async function SurahPage({ params, searchParams }: SurahPageProps): Promise<React.JSX.Element> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    Promise.resolve(searchParams ?? {}),
  ]);

  const startVerseRaw = resolvedSearchParams?.startVerse;
  const parsedStartVerse = startVerseRaw ? Number.parseInt(startVerseRaw, 10) : undefined;
  const initialVerseNumber =
    typeof parsedStartVerse === 'number' &&
      Number.isFinite(parsedStartVerse) &&
      parsedStartVerse > 0
      ? parsedStartVerse
      : undefined;

  const surahNumber = Number.parseInt(resolvedParams.surahId, 10);
  const canFetchMetadata = Number.isFinite(surahNumber) && surahNumber > 0;

  const DEFAULT_INITIAL_TRANSLATION_IDS = [20];
  const DEFAULT_INITIAL_WORD_LANG = 'en';

  let totalVerses: number | undefined;
  let initialVerses: Verse[] | undefined;

  const language = ensureLanguageCode(DEFAULT_INITIAL_WORD_LANG);

  const [chapterResult, versesResult] = await Promise.allSettled([
    canFetchMetadata ? getChapter(surahNumber, language) : Promise.resolve(null),
    getVersesByChapter({
      id: resolvedParams.surahId,
      translationIds: DEFAULT_INITIAL_TRANSLATION_IDS,
      page: 1,
      perPage: 20,
      wordLang: language,
    }),
  ]);

  if (chapterResult.status === 'fulfilled' && chapterResult.value) {
    totalVerses = chapterResult.value.verses_count;
  }

  if (versesResult.status === 'fulfilled') {
    initialVerses = versesResult.value.verses;
  }

  const surahViewProps = {
    ...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {}),
    ...(typeof totalVerses === 'number' ? { totalVerses } : {}),
    ...(initialVerses ? { initialVerses } : {}),
    initialVersesParams: {
      translationIds: DEFAULT_INITIAL_TRANSLATION_IDS,
      wordLang: language,
    },
  } satisfies Record<string, unknown>;

  return <SurahView surahId={resolvedParams.surahId} {...surahViewProps} />;
}

export default SurahPage;
