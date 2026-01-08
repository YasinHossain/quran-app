/**
 * Server-rendered Surah grid component.
 * This component pre-renders the 114 Surah cards on the server using the same
 * shared components as the client-side grid. This ensures consistent design
 * while providing instant content visibility.
 *
 * Note: Even though SurahCard/SurahGrid are client components, Next.js will
 * still pre-render their HTML on the server. They just hydrate on the client
 * for interactivity.
 */

import { SurahCard } from './SurahCard';
import { NavigationCardGrid } from './NavigationCardGrid';

import type { Chapter } from '@/types';

interface SurahGridServerProps {
    chapters: ReadonlyArray<Chapter>;
    className?: string;
}

/**
 * Server-rendered grid of all Surahs.
 * Uses the same SurahCard component as the client-side grid for consistent design.
 * Pre-renders all 114 Surah cards for instant display.
 */
export function SurahGridServer({ chapters, className }: SurahGridServerProps): React.JSX.Element {
    return (
        <NavigationCardGrid className={className ? `pb-4 ${className}` : 'pb-4'}>
            {chapters.map((chapter) => (
                <SurahCard key={chapter.id} chapter={chapter} />
            ))}
        </NavigationCardGrid>
    );
}
