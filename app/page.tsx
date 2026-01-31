/**
 * Home Page - Server Component
 *
 * Pre-renders the homepage (chapters + verse of day) for fast navigation and TTFB.
 * This route intentionally lives outside the `(features)` layout so the reader/header
 * shell never flashes on the homepage.
 */

import type { Metadata } from 'next';

import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import { HomePageClient } from './(features)/home/components/HomePageClient';
import { SurahGridStaticServer } from './(features)/home/components/SurahGridStaticServer';
import { HeaderVisibilityProvider } from './(features)/layout/context/HeaderVisibilityContext';
import { Navigation } from './shared/IconSidebar';
import { ModernLayout } from './shared/navigation/ModernLayout';

// This page reads user preferences (theme + UI language) from cookies in `app/layout.tsx`.
// Marking it as static would cause the server HTML to always render with defaults (English + light),
// resulting in a visible flash on refresh.

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} – Read, Listen, and Study the Holy Quran`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/'),
  },
};

export default async function Page(): Promise<React.JSX.Element> {
  const [chapters, versesOfDay] = await Promise.all([getChaptersServer(), getVersesOfDayServer()]);

  return (
    <HeaderVisibilityProvider>
      <ModernLayout>
        {/* Mobile bottom navigation is OK on home; desktop rail stays hidden. */}
        <Navigation pathnameOverride="/" />
        <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
          <SurahGridStaticServer chapters={chapters} />
        </HomePageClient>
      </ModernLayout>
    </HeaderVisibilityProvider>
  );
}
