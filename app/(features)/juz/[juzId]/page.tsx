import { JuzClient } from './JuzClient';
import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ juzId: string }>;
}): Promise<Metadata> {
  const { juzId } = await params;
  const canonicalPath = `/juz/${encodeURIComponent(juzId)}`;

  return {
    title: `Juz ${juzId}`,
    description: `Read Quran by Juz ${juzId} on ${SITE_NAME}.`,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

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
