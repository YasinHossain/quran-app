import { getRandomVerse } from '@/lib/api/verses/extras';

import { HomePage } from './components/HomePage';

// Static generation - pre-renders at build time for instant TTFB
export const dynamic = 'force-static';
// Revalidate every hour (3600 seconds) to rotate the verse
export const revalidate = 3600;

export default async function Page(): Promise<React.JSX.Element> {
  const DEFAULT_TRANSLATION_ID = 131; // Dr. Mustafa Khattab
  let initialVerse;
  try {
    initialVerse = await getRandomVerse(DEFAULT_TRANSLATION_ID);
  } catch (e) {
    // If fetch fails during build, we can let the client handle it or just render without initial verse
    console.error('Failed to fetch initial verse of day', e);
  }

  return <HomePage initialVerse={initialVerse} />;
}
