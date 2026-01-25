/**
 * Home Page - Server Component
 *
 * Pre-renders the homepage (chapters + verse of day) for fast navigation and TTFB.
 * This route intentionally lives outside the `(features)` layout so the reader/header
 * shell never flashes on the homepage.
 */

import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';

import { HomePageClient } from '@/app/(features)/home/components/HomePageClient';
import { SurahGridServer } from '@/app/(features)/home/components/SurahGridServer';
import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { Navigation } from '@/app/shared/IconSidebar';
import { ModernLayout } from '@/app/shared/navigation/ModernLayout';

import { isUiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { Suspense } from 'react';

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: { lang: string };
}): Promise<React.JSX.Element> {
  const lang = isUiLanguageCode(params.lang) ? params.lang : 'en';
  const [chapters, versesOfDay] = await Promise.all([getChaptersServer(), getVersesOfDayServer()]);

  return (
    <HeaderVisibilityProvider>
      <ModernLayout>
        {/* Mobile bottom navigation is OK on home; desktop rail stays hidden. */}
        <Suspense fallback={null}>
          <Navigation pathnameOverride={`/${lang}`} />
        </Suspense>
        <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
          <SurahGridServer chapters={chapters} />
        </HomePageClient>
      </ModernLayout>
    </HeaderVisibilityProvider>
  );
}
