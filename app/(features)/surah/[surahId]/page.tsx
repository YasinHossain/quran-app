import { SurahView } from '../components';

interface SurahPageProps {
  params: Promise<{ surahId: string }>;
}

/**
 * Surah page component for displaying a specific Surah.
 * Server component that handles async params and renders the SurahView.
 */
async function SurahPage({ params }: SurahPageProps): Promise<React.JSX.Element> {
  const { surahId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <SurahView surahId={surahId} />
    </div>
  );
}

export default SurahPage;
