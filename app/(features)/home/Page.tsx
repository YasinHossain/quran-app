import { getRandomVerses } from '@/lib/api/verses/extras';

import { HomePage } from './components/HomePage';

// This page reads user preferences (theme + UI language) from cookies in `app/layout.tsx`.
// Marking it as static would cause the server HTML to always render with defaults (English + light),
// resulting in a visible flash on refresh.

export default async function Page(): Promise<React.JSX.Element> {
  const DEFAULT_TRANSLATION_ID = 20; // Sahih International
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
