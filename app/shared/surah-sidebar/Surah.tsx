import { formatSurahSubtitle } from '@/app/shared/navigation/formatSurahSubtitle';
import { useNavigationTargets } from '@/app/shared/navigation/hooks/useNavigationTargets';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { SurahNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { getJuzByPage } from '@/lib/utils/surah-navigation';

import type { Chapter } from '@/types';

interface Props {
  chapters: ReadonlyArray<Chapter>;
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
}: Props): React.JSX.Element => {
  const { getSurahHref, goToSurah } = useNavigationTargets();

  return (
    <ul className="space-y-2">
      {chapters.map((chapter) => {
        const isActive = chapter.id === selectedSurahId;
        return (
          <li key={chapter.id}>
            <SurahNavigationCard
              href={isTafsirPath ? buildTafsirRoute(chapter.id, 1) : getSurahHref(chapter.id)}
              scroll={false}
              data-active={isActive}
              isActive={isActive}
              content={{
                id: chapter.id,
                title: chapter.name_simple,
                subtitle: formatSurahSubtitle(chapter),
                arabic: chapter.name_arabic,
              }}
              onNavigate={() => {
                setSelectedSurahId(chapter.id);
                const firstPage = chapter.pages?.[0] ?? 1;
                setSelectedPageId(firstPage);
                setSelectedJuzId(getJuzByPage(firstPage));
                rememberScroll();
                if (!isTafsirPath) {
                  goToSurah(chapter.id);
                }
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};
