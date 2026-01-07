import { memo, useEffect, useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

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
  onClose?: (() => void) | undefined;
}

interface JuzItemProps {
  juz: JuzSummary;
  isActive: boolean;
  getJuzHref: (n: number) => string;
  onNavigate: (juz: JuzSummary) => void;
}

const JuzItem = memo(function JuzItem({
  juz,
  isActive,
  getJuzHref,
  onNavigate,
}: JuzItemProps) {
  return (
    <div className="pb-2">
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
        onNavigate={() => onNavigate(juz)}
      />
    </div>
  );
});

export const Juz = ({
  juzs,
  chapters,
  selectedJuzId,
  setSelectedJuzId,
  setSelectedPageId,
  setSelectedSurahId,
  rememberScroll,
  onClose,
}: Props): React.JSX.Element => {
  const { getJuzHref, goToJuz } = useNavigationTargets();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Scroll to selected juz when it changes (e.g., when switching tabs)
  useEffect(() => {
    if (selectedJuzId === null) return;
    const selectedIndex = juzs.findIndex((j) => j.number === selectedJuzId);
    if (selectedIndex !== -1) {
      virtuosoRef.current?.scrollToIndex({
        index: selectedIndex,
        align: 'center',
        behavior: 'auto',
      });
    }
  }, [selectedJuzId, juzs]);

  const handleNavigate = (juz: JuzSummary): void => {
    onClose?.();
    setSelectedJuzId(juz.number);
    const page = JUZ_START_PAGES[juz.number - 1] ?? 1;
    setSelectedPageId(page);
    const chap = getSurahByPage(page, chapters);
    if (chap) setSelectedSurahId(chap.id);
    rememberScroll();
    goToJuz(juz.number);
  };

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={juzs as JuzSummary[]}
      style={{ height: '100%' }}
      itemContent={(_, juz) => (
        <JuzItem
          juz={juz}
          isActive={juz.number === selectedJuzId}
          getJuzHref={getJuzHref}
          onNavigate={handleNavigate}
        />
      )}
    />
  );
};
