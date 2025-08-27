import SurahClient from './SurahClient';

export default async function Page({ params }: { params: Promise<{ surahId: string }> }) {
  const { surahId } = await params;
  return <SurahClient surahId={surahId} />;
}
