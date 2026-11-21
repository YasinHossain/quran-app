/**
 * Home Page - Server Component
 *
 * Pre-renders the homepage (chapters + verse of day) for fast navigation and TTFB.
 * This route intentionally lives outside the `(features)` layout so the reader/header
 * shell never flashes on the homepage.
 */

import { getRequestUiLanguage, getServerTranslator } from '@/app/shared/i18n/serverLocale';
import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { HomePageClient } from './(features)/home/components/HomePageClient';
import { SurahGridStaticServer } from './(features)/home/components/SurahGridStaticServer';
import { HeaderVisibilityProvider } from './(features)/layout/context/HeaderVisibilityContext';
import { Navigation } from './shared/IconSidebar';
import { ModernLayout } from './shared/navigation/ModernLayout';

import type { Metadata } from 'next';

// This page reads user preferences (theme + UI language) from cookies in `app/layout.tsx`.
// Marking it as static would cause the server HTML to always render with defaults (English + light),
// resulting in a visible flash on refresh.

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestUiLanguage();
  const { t } = await getServerTranslator(locale);
  const description = t('seo_site_description', { siteName: SITE_NAME });

  const metadata = buildLocalizedPageMetadata({
    path: '/',
    locale,
    title: `${SITE_NAME} – ${t('seo_home_title')}`,
    description,
    absoluteTitle: true,
  });
  // Social cards keep the bare brand name; the root segment's image files still apply here.
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, title: SITE_NAME },
    twitter: { card: 'summary_large_image', title: SITE_NAME, description },
  };
}

export default async function Page(): Promise<React.JSX.Element> {
  const [chapters, versesOfDay] = await Promise.all([
    getChaptersServer().catch((error) => {
      logger.warn('Failed to load homepage chapters', undefined, error as Error);
      return [];
    }),
    getVersesOfDayServer(),
  ]);

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
