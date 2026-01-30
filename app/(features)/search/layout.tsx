import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Search',
  description: `Search the Holy Quran on ${SITE_NAME}.`,
  alternates: {
    canonical: absoluteUrl('/search'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}

