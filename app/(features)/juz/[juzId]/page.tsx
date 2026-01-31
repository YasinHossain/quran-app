import { JuzClient } from './JuzClient';

export default async function Page({
  params,
}: {
  params: Promise<{ juzId: string }>;
}): Promise<React.JSX.Element> {
  const { juzId } = await params;
  return (
    <div className="min-h-screen bg-background">
      <JuzClient juzId={juzId} />
    </div>
  );
}
