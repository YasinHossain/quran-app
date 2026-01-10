/**
 * Home Page - Server Component
 *
 * This is a Server Component that pre-renders the homepage with all 114 Surahs.
 * The page fetches data on the server, eliminating the client-side waterfall:
 *
 * Before (Client-side):
 * 1. Browser downloads HTML (empty shell)
 * 2. JavaScript bundle downloads
 * 3. JS executes and fetches API data
 * 4. Content finally appears (~5s on slow networks)
 *
 * After (Server-side):
 * 1. Browser downloads HTML (with all 114 Surahs pre-rendered)
 * 2. Content appears immediately
 * 3. JavaScript hydrates for interactivity
 */

import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';

import { HomePageClient } from './(features)/home/components/HomePageClient';
import { SurahGridServer } from './(features)/home/components/SurahGridServer';
import FeaturesLayout from './(features)/layout';

export default async function Page(): Promise<React.JSX.Element> {
  // Fetch chapters and verses on the server - cached for 1 hour
  const [chapters, versesOfDay] = await Promise.all([getChaptersServer(), getVersesOfDayServer()]);

  return (
    <FeaturesLayout>
      <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
        {/* Server-rendered Surah grid - appears instantly */}
        <SurahGridServer chapters={chapters} />
      </HomePageClient>
    </FeaturesLayout>
  );
}
