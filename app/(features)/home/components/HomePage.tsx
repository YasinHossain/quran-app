import { getChaptersServer, getVersesOfDayServer } from '@/lib/api/server';

import { HomePageClient } from './HomePageClient';
import { SurahGridServer } from './SurahGridServer';

export async function HomePage(): Promise<React.JSX.Element> {
  const [chapters, versesOfDay] = await Promise.all([getChaptersServer(), getVersesOfDayServer()]);

  return (
    <HomePageClient initialChapters={chapters} initialVerses={versesOfDay}>
      <SurahGridServer chapters={chapters} />
    </HomePageClient>
  );
}
