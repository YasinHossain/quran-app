/**
 * Home Page - Server Component
 *
 * Pre-renders the homepage (chapters + verse of day) for fast navigation and TTFB.
 * This route intentionally lives outside the `(features)` layout so the reader/header
 * shell never flashes on the homepage.
 */

import {
  getPageUiLanguage,
  getServerTranslator,
  type LangParams,
} from '@/app/shared/i18n/serverLocale';
import { Navigation } from '@/app/shared/IconSidebar';
import { ModernLayout } from '@/app/shared/navigation/ModernLayout';
import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';
import { SITE_TWITTER_IMAGE, buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';

import { HomePageClient } from './(features)/home/components/HomePageClient';
import { SurahGridStaticServer } from './(features)/home/components/SurahGridStaticServer';
import { HeaderVisibilityProvider } from './(features)/layout/context/HeaderVisibilityContext';

import type { Metadata } from 'next';

// The verses of the day rotate hourly (`getVersesOfDayServer`).
export const revalidate = 3600;
// Only the enabled languages exist (from the layout's `generateStaticParams`). Root-level paths the
// proxy leaves alone (`/wp-login.php`) 404 here without a render or a cache entry each.
export const dynamicParams = false;

interface HomePageProps {
  params: LangParams;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await getPageUiLanguage(params);
  const { t } = await getServerTranslator(locale);
  const description = t('seo_site_description', { siteName: SITE_NAME });

  const metadata = buildLocalizedPageMetadata({
    path: '/',
    locale,
    title: `${SITE_NAME} – ${t('seo_home_title')}`,
    description,
    absoluteTitle: true,
  });
  // Social cards keep the bare brand name and the shared site images.
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, title: SITE_NAME },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      images: [SITE_TWITTER_IMAGE],
    },
  };
}

export default async function Page({ params }: HomePageProps): Promise<React.JSX.Element> {
  const locale = await getPageUiLanguage(params);
  const [chapters, versesOfDay] = await Promise.all([
    // Throws on upstream failure so the cached (ISR) home page is never stored without surahs.
    getChaptersServer(),
    getVersesOfDayServer(),
  ]);

  return (
    <HeaderVisibilityProvider>
      <ModernLayout>
        {/* Mobile bottom navigation is OK on home; desktop rail stays hidden. */}
        <Navigation pathnameOverride="/" />
        <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
          <SurahGridStaticServer chapters={chapters} locale={locale} />
        </HomePageClient>
      </ModernLayout>
    </HeaderVisibilityProvider>
  );
}
