import { PageClient } from './PageClient';
import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

/** None at build time; defining it (even empty) makes the route ISR instead of per request. */
export function generateStaticParams(): Array<{ pageId: string }> {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageId: string }>;
}): Promise<Metadata> {
  const { pageId } = await params;
  const canonicalPath = `/page/${encodeURIComponent(pageId)}`;

  return {
    title: `Page ${pageId}`,
    description: `Read Quran by Mushaf page ${pageId} on ${SITE_NAME}.`,
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
  params: Promise<{ pageId: string }>;
}): Promise<React.JSX.Element> {
  const { pageId } = await params;
  return (
    <div className="min-h-screen bg-background">
      <PageClient pageId={pageId} />
    </div>
  );
}
