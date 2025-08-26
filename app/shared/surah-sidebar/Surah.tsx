import type { Chapter } from '@/types';
import { getJuzByPage } from '@/lib/utils/surah-navigation';
import { SurahNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

interface Props {
  chapters: Chapter[];
  selectedSurahId: string | null;
  setSelectedSurahId: (id: string) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedJuzId: (id: string) => void;
  rememberScroll: () => void;
  isTafsirPath: boolean;
}

const Surah = ({
  chapters,
  selectedSurahId,
  setSelectedSurahId,
  setSelectedPageId,
  setSelectedJuzId,
  rememberScroll,
  isTafsirPath,
}: Props) => (
  <ul className="space-y-2">
    {chapters.map((chapter) => {
      const isActive = String(chapter.id) === selectedSurahId;
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
              setSelectedSurahId(String(chapter.id));
              const firstPage = chapter.pages?.[0] ?? 1;
              setSelectedPageId(String(firstPage));
              setSelectedJuzId(String(getJuzByPage(firstPage)));
              rememberScroll();
            }}
          />
        </li>
      );
    })}
  </ul>
);

export default Surah;
