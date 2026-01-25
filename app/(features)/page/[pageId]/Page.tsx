import { PageClient } from './PageClient';

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>;
}): Promise<React.JSX.Element> {
  const { pageId } = await params;
  return (
    <div className="min-h-screen bg-background">
      <PageClient pageId={pageId} />
    </div>
  );
}
