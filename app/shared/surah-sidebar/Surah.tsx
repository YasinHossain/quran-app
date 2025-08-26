import type { Chapter } from '@/types';
import { getJuzByPage } from '@/lib/utils/surah-navigation';
import { SidebarCard } from '@/app/shared/ui/SidebarCard';
import { NumberBadge } from '@/app/shared/ui/NumberBadge';

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
          <SidebarCard
            href={isTafsirPath ? `/tafsir/${chapter.id}/1` : `/surah/${chapter.id}`}
            scroll={false}
            data-active={isActive}
            isActive={isActive}
            className="items-center ml-2"
            onClick={() => {
              setSelectedSurahId(String(chapter.id));
              const firstPage = chapter.pages?.[0] ?? 1;
              setSelectedPageId(String(firstPage));
              setSelectedJuzId(String(getJuzByPage(firstPage)));
              rememberScroll();
            }}
          >
            <NumberBadge number={chapter.id} isActive={isActive} />
            <div className="flex-grow min-w-0">
              <p
                className={`font-bold transition-colors truncate leading-tight mb-0 ${
                  isActive ? 'text-on-accent' : 'text-foreground'
                }`}
              >
                {chapter.name_simple}
              </p>
              <p
                className={`text-xs truncate leading-tight mt-2 mb-0 ${
                  isActive ? 'text-on-accent/80' : 'text-muted'
                }`}
              >
                {chapter.revelation_place.charAt(0).toUpperCase() + chapter.revelation_place.slice(1)} • {chapter.verses_count} verses
              </p>
            </div>
            <p
              className={`font-amiri text-xl font-bold transition-colors whitespace-nowrap ${
                isActive ? 'text-on-accent' : 'text-muted group-hover:text-accent'
              }`}
            >
              {chapter.name_arabic}
            </p>
          </SidebarCard>
        </li>
      );
    })}
  </ul>
);

export default Surah;
