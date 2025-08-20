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
            onClick={() => {
              setSelectedSurahId(String(chapter.id));
              const firstPage = chapter.pages?.[0] ?? 1;
              setSelectedPageId(String(firstPage));
              setSelectedJuzId(String(getJuzByPage(firstPage)));
              rememberScroll();
            }}
          >
            <NumberBadge number={chapter.id} isActive={isActive} />
            <div className="flex-grow">
              <p
                className={`font-bold transition-colors ${isActive ? 'text-on-accent' : 'text-foreground'}`}
              >
                {chapter.name_simple}
              </p>
              <p className={`text-xs ${isActive ? 'text-on-accent/80' : 'text-muted'}`}>
                {chapter.revelation_place} • {chapter.verses_count} verses
              </p>
            </div>
            <p
              className={`font-amiri text-xl font-bold transition-colors ${
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
