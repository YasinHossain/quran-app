import { getChapters } from '@/lib/api/chapters';
import { HomePageClient } from './HomePageClient';
import { SurahGridServer } from './SurahGridServer';
import type { Chapter, Verse } from '@/types';

interface HomePageProps {
    initialVerse?: Verse | undefined;
}

export async function HomePage({ initialVerse }: HomePageProps) {
    let chapters: Chapter[] = [];
    try {
        chapters = await getChapters();
    } catch (e) {
        console.error("Failed to fetch chapters", e);
    }

    return (
        <HomePageClient initialChapters={chapters} initialVerse={initialVerse}>
            <SurahGridServer chapters={chapters} />
        </HomePageClient>
    );
}
