import Link from 'next/link';
import type { Chapter } from '@/types';
import { getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface Props {
  juzs: JuzSummary[];
  chapters: Chapter[];
  selectedJuzId: string | null;
  setSelectedJuzId: (id: string) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedSurahId: (id: string) => void;
  rememberScroll: () => void;
}

const Juz = ({
  juzs,
  chapters,
  selectedJuzId,
  setSelectedJuzId,
  setSelectedPageId,
  setSelectedSurahId,
  rememberScroll,
}: Props) => (
  <ul className="space-y-2">
    {juzs.map((juz) => {
      const isActive = String(juz.number) === selectedJuzId;
      return (
        <li key={juz.number}>
          <Link
            href={`/juz/${juz.number}`}
            scroll={false}
            data-active={isActive}
            onClick={() => {
              setSelectedJuzId(String(juz.number));
              const page = JUZ_START_PAGES[juz.number - 1];
              setSelectedPageId(String(page));
              const chap = getSurahByPage(page, chapters);
              if (chap) setSelectedSurahId(String(chap.id));
              rememberScroll();
            }}
            className={`group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02] ${
              isActive
                ? 'bg-accent text-on-accent shadow-lg shadow-accent/30'
                : 'bg-surface text-primary hover:bg-accent/10 shadow'
            }`}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow transition-colors ${
                isActive
                  ? 'bg-surface text-accent'
                  : 'bg-surface text-accent group-hover:bg-accent/10'
              }`}
            >
              {juz.number}
            </div>
            <div>
              <p className={`font-semibold ${isActive ? 'text-on-accent' : 'text-primary'}`}>
                Juz {juz.number}
              </p>
              <p className={`text-xs ${isActive ? 'text-on-accent/90' : 'text-muted'}`}>
                {juz.surahRange}
              </p>
            </div>
          </Link>
        </li>
      );
    })}
  </ul>
);

export default Juz;
