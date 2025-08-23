import JuzClient from './JuzClient';

export default async function Page({ params }: { params: Promise<{ juzId: string }> }) {
  const { juzId } = await params;
  return <JuzClient juzId={juzId} />;
}
