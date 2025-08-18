import Link from 'next/link';
import type { Chapter } from '@/types';
import { getJuzByPage, getSurahByPage } from '@/lib/utils/surah-navigation';

interface Props {
  pages: number[];
  chapters: Chapter[];
  selectedPageId: string | null;
  setSelectedPageId: (id: string) => void;
  setSelectedJuzId: (id: string) => void;
  setSelectedSurahId: (id: string) => void;
  rememberScroll: () => void;
}

const Page = ({
  pages,
  chapters,
  selectedPageId,
  setSelectedPageId,
  setSelectedJuzId,
  setSelectedSurahId,
  rememberScroll,
}: Props) => (
  <ul className="space-y-2">
    {pages.map((p) => {
      const isActive = String(p) === selectedPageId;
      return (
        <li key={p}>
          <Link
            href={`/page/${p}`}
            scroll={false}
            data-active={isActive}
            onClick={() => {
              setSelectedPageId(String(p));
              setSelectedJuzId(String(getJuzByPage(p)));
              const chap = getSurahByPage(p, chapters);
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
              {p}
            </div>
            <p className={`font-semibold ${isActive ? 'text-on-accent' : 'text-primary'}`}>
              Page {p}
            </p>
          </Link>
        </li>
      );
    })}
  </ul>
);

export default Page;
