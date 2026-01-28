import { getChapters } from '@/lib/api/chapters';

import { HomePageClient } from './HomePageClient';
import { SurahGridServer } from './SurahGridServer';

import type { Chapter } from '@/types';

export async function HomePage(): Promise<React.JSX.Element> {
  let chapters: Chapter[] = [];
  try {
    chapters = await getChapters();
  } catch (e) {
    console.error('Failed to fetch chapters', e);
  }

  return (
    <HomePageClient initialChapters={chapters}>
      <SurahGridServer chapters={chapters} />
    </HomePageClient>
  );
}
