/**
 * Home Page - Server Component
 *
 * Pre-renders the homepage (chapters + verse of day) for fast navigation and TTFB.
 * This route intentionally lives outside the `(features)` layout so the reader/header
 * shell never flashes on the homepage.
 */

import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';

import { HomePageClient } from './(features)/home/components/HomePageClient';
import { SurahGridServer } from './(features)/home/components/SurahGridServer';
import { HeaderVisibilityProvider } from './(features)/layout/context/HeaderVisibilityContext';
import { Navigation } from './shared/IconSidebar';
import { ModernLayout } from './shared/navigation/ModernLayout';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Page(): Promise<React.JSX.Element> {
  const [chapters, versesOfDay] = await Promise.all([getChaptersServer(), getVersesOfDayServer()]);

  return (
    <HeaderVisibilityProvider>
      <ModernLayout>
        {/* Mobile bottom navigation is OK on home; desktop rail stays hidden. */}
        <Navigation pathnameOverride="/" />
        <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
          <SurahGridServer chapters={chapters} />
        </HomePageClient>
      </ModernLayout>
    </HeaderVisibilityProvider>
  );
}
