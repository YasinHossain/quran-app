import { SurahView } from '../components';

export default async function Page({ params }: { params: Promise<{ surahId: string }> }) {
  const { surahId } = await params;
  return <SurahView surahId={surahId} />;
}
