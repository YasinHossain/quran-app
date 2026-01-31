import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import { BookmarksProviders } from './BookmarksProviders';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: `Bookmarks and reading history (stored locally on your device) on ${SITE_NAME}.`,
  alternates: {
    canonical: absoluteUrl('/bookmarks'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <BookmarksProviders>{children}</BookmarksProviders>;
}

