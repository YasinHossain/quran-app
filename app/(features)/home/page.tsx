import { getRandomVerses } from '@/lib/api/verses/extras';

import { HomePage } from './components/HomePage';

// Static generation - pre-renders at build time for instant TTFB
export const dynamic = 'force-static';
// Revalidate every hour (3600 seconds) to rotate the verses
export const revalidate = 3600;

export default async function Page(): Promise<React.JSX.Element> {
  const DEFAULT_TRANSLATION_ID = 131; // Dr. Mustafa Khattab
  let initialVerses;
  try {
    // Fetch 5 random verses at build time for the rotation
    initialVerses = await getRandomVerses(5, DEFAULT_TRANSLATION_ID);
  } catch (e) {
    // If fetch fails during build, we can let the client handle it or just render without verses
    console.error('Failed to fetch initial verses of day', e);
  }

  return <HomePage initialVerses={initialVerses} />;
}
