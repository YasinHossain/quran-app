import { getChapters } from '@/lib/api/chapters';
import { HomePageClient } from './HomePageClient';
import { SurahGridServer } from './SurahGridServer';
import type { Chapter, Verse } from '@/types';

interface HomePageProps {
    initialVerses?: Verse[] | undefined;
}

export async function HomePage({ initialVerses }: HomePageProps) {
    let chapters: Chapter[] = [];
    try {
        chapters = await getChapters();
    } catch (e) {
        console.error('Failed to fetch chapters', e);
    }

    return (
        <HomePageClient initialChapters={chapters} initialVerses={initialVerses}>
            <SurahGridServer chapters={chapters} />
        </HomePageClient>
    );
}
