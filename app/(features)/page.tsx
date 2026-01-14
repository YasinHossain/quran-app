/**
 * Home Page - Server Component
 *
 * Pre-renders the homepage (chapters + verse of day) for fast navigation and TTFB.
 * This route lives under the `(features)` group so the app shell (header/nav) is shared
 * and preserved across Home/Surah/Bookmarks navigation.
 */

import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';

import { HomePageClient } from './home/components/HomePageClient';
import { SurahGridServer } from './home/components/SurahGridServer';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Page(): Promise<React.JSX.Element> {
  const [chapters, versesOfDay] = await Promise.all([getChaptersServer(), getVersesOfDayServer()]);

  return (
    <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
      <SurahGridServer chapters={chapters} />
    </HomePageClient>
  );
}
