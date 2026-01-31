import { SurahView } from '@/app/(features)/surah/components';
import { getSurahInitialDataServer } from '@/lib/api/server';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { Verse } from '@/types';

// Cache this page for 1 hour - makes subsequent visits instant
// Translation changes are handled client-side by SWR
export const revalidate = 3600;

interface SurahPageProps {
  params: Promise<{ surahId: string }>;
}

/**
 * Surah page component for displaying a specific Surah.
 * Server component that handles async params and renders the SurahView.
 */
async function SurahPage({ params }: SurahPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await params;

  const DEFAULT_INITIAL_TRANSLATION_IDS = [20];
  const DEFAULT_INITIAL_WORD_LANG = 'en';
  const INITIAL_VERSES_PER_PAGE = 20;

  let totalVerses: number | undefined;
  let initialVerses: Verse[] | undefined;

  const language = ensureLanguageCode(DEFAULT_INITIAL_WORD_LANG);

  const initialData = await getSurahInitialDataServer({
    surahId: resolvedParams.surahId,
    translationIds: DEFAULT_INITIAL_TRANSLATION_IDS,
    wordLang: language,
    perPage: INITIAL_VERSES_PER_PAGE,
  });

  totalVerses = initialData.totalVerses;
  initialVerses = initialData.initialVerses;

  const surahViewProps = {
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
