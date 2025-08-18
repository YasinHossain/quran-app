import Link from 'next/link';
import type { Chapter } from '@/types';
import { getJuzByPage } from '@/lib/utils/surah-navigation';

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
          <Link
            href={isTafsirPath ? `/tafsir/${chapter.id}/1` : `/surah/${chapter.id}`}
            scroll={false}
            data-active={isActive}
            onClick={() => {
              setSelectedSurahId(String(chapter.id));
              const firstPage = chapter.pages?.[0] ?? 1;
              setSelectedPageId(String(firstPage));
              setSelectedJuzId(String(getJuzByPage(firstPage)));
              rememberScroll();
            }}
            className={`group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02] ${
              isActive
                ? 'bg-accent text-on-accent shadow-lg shadow-accent/30'
                : 'bg-surface text-foreground hover:bg-accent/10 shadow'
            }`}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow transition-colors ${
                isActive
                  ? 'bg-surface text-accent'
                  : 'bg-surface text-accent group-hover:bg-accent/10'
              }`}
            >
              {chapter.id}
            </div>
            <div className="flex-grow">
              <p className={`font-bold ${isActive ? 'text-on-accent' : 'text-foreground'}`}>
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
          </Link>
        </li>
      );
    })}
  </ul>
);

export default Surah;
