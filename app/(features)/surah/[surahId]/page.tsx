import { SurahView } from '@/app/(features)/surah/components';

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
    typeof parsedStartVerse === 'number' && Number.isFinite(parsedStartVerse) && parsedStartVerse > 0
      ? parsedStartVerse
      : undefined;

  return <SurahView surahId={resolvedParams.surahId} initialVerseNumber={initialVerseNumber} />;
}

export default SurahPage;
