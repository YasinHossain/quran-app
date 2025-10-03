import { useNavigationTargets } from '@/app/shared/navigation/hooks/useNavigationTargets';
import { JuzNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';

import type { JuzSummary } from '@/app/shared/navigation/types';
import type { Chapter } from '@/types';

interface Props {
  juzs: ReadonlyArray<JuzSummary>;
  chapters: ReadonlyArray<Chapter>;
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number) => void;
  setSelectedPageId: (id: number) => void;
  setSelectedSurahId: (id: number) => void;
  rememberScroll: () => void;
}

export const Juz = ({
  juzs,
  chapters,
  selectedJuzId,
  setSelectedJuzId,
  setSelectedPageId,
  setSelectedSurahId,
  rememberScroll,
}: Props): React.JSX.Element => {
  const { getJuzHref, goToJuz } = useNavigationTargets();

  return (
    <ul className="space-y-2">
      {juzs.map((juz) => {
        const isActive = juz.number === selectedJuzId;
        return (
          <li key={juz.number}>
            <JuzNavigationCard
              href={getJuzHref(juz.number)}
              scroll={false}
              data-active={isActive}
              isActive={isActive}
              content={{
                id: juz.number,
                title: `Juz ${juz.number}`,
                subtitle: juz.surahRange,
              }}
              onNavigate={() => {
                setSelectedJuzId(juz.number);
                const page = JUZ_START_PAGES[juz.number - 1];
                setSelectedPageId(page);
                const chap = getSurahByPage(page, chapters);
                if (chap) setSelectedSurahId(chap.id);
                rememberScroll();
                goToJuz(juz.number);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};
