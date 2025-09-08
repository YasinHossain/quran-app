import { SurahNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type { Chapter } from '@/types';

interface Props {
  chapters: Chapter[];
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number) => void;
  setSelectedPageId: (id: number) => void;
  setSelectedJuzId: (id: number) => void;
  rememberScroll: () => void;
  isTafsirPath: boolean;
}

export const Surah = ({
  chapters,
  selectedSurahId,
  setSelectedSurahId,
  setSelectedPageId,
  setSelectedJuzId,
  rememberScroll,
  isTafsirPath,
}: Props): React.JSX.Element => (
  <ul className="space-y-2">
    {chapters.map((chapter) => {
      const isActive = chapter.id === selectedSurahId;
      return (
        <li key={chapter.id}>
          <SurahNavigationCard
            href={isTafsirPath ? `/tafsir/${chapter.id}/1` : `/surah/${chapter.id}`}
            scroll={false}
            data-active={isActive}
            isActive={isActive}
            content={{
              id: chapter.id,
              title: chapter.name_simple,
              subtitle: `${chapter.revelation_place.charAt(0).toUpperCase() + chapter.revelation_place.slice(1)} • ${chapter.verses_count} verses`,
              arabic: chapter.name_arabic,
            }}
            onNavigate={() => {
              setSelectedSurahId(chapter.id);
              const firstPage = chapter.pages?.[0] ?? 1;
              setSelectedPageId(firstPage);
              setSelectedJuzId(getJuzByPage(firstPage));
              rememberScroll();
            }}
          />
        </li>
      );
    })}
  </ul>
);
