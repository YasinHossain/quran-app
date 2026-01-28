import { unstable_cache } from 'next/cache';

import { getRandomVerses } from '@/lib/api/verses/extras';

import { HomePage } from './components/HomePage';

// This page reads user preferences (theme + UI language) from cookies in `app/layout.tsx`.
// Marking it as static would cause the server HTML to always render with defaults (English + light),
// resulting in a visible flash on refresh.

const VERSE_OF_DAY_COUNT = 5;
const VERSE_OF_DAY_CACHE_SECONDS = 60 * 60; // 1 hour
const DEFAULT_TRANSLATION_ID = 20; // Sahih International

const getCachedRandomVerses = unstable_cache(
  async (count: number, translationId: number) => getRandomVerses(count, translationId),
  ['home-verse-of-day'],
  { revalidate: VERSE_OF_DAY_CACHE_SECONDS }
);

export default async function Page(): Promise<React.JSX.Element> {
  let initialVerses;
  try {
    // Fetch cached random verses for the rotation (refreshes hourly)
    initialVerses = await getCachedRandomVerses(VERSE_OF_DAY_COUNT, DEFAULT_TRANSLATION_ID);
  } catch (e) {
    // If fetch fails during build, we can let the client handle it or just render without verses
    console.error('Failed to fetch initial verses of day', e);
  }

  return <HomePage initialVerses={initialVerses} />;
}
