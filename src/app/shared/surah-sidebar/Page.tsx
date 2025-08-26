import type { Chapter } from '@/types';
import { getJuzByPage, getSurahByPage } from '@/lib/utils/surah-navigation';
import { PageNavigationCard } from '@/presentation/shared/ui/cards/StandardNavigationCard';

interface Props {
  pages: number[];
  chapters: Chapter[];
  selectedPageId: number | null;
  setSelectedPageId: (id: number) => void;
  setSelectedJuzId: (id: number) => void;
  setSelectedSurahId: (id: number) => void;
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
      const isActive = p === selectedPageId;
      return (
        <li key={p}>
          <PageNavigationCard
            href={`/page/${p}`}
            scroll={false}
            data-active={isActive}
            isActive={isActive}
            content={{
              id: p,
              title: `Page ${p}`,
            }}
            onNavigate={() => {
              setSelectedPageId(p);
              setSelectedJuzId(getJuzByPage(p));
              const chap = getSurahByPage(p, chapters);
              if (chap) setSelectedSurahId(chap.id);
              rememberScroll();
            }}
          />
        </li>
      );
    })}
  </ul>
);

export default Page;
