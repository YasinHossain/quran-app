import { memo, useRef } from 'react';
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
  scrollParent?: HTMLElement;
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
        prefetch={false}
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
  scrollParent,
  onClose,
}: Props): React.JSX.Element => {
  const { getJuzHref } = useNavigationTargets();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Note: Scroll centering is handled by the parent useScrollCentering hook
  // which uses [data-active] attributes and scrollIntoView for consistency

  const handleNavigate = (juz: JuzSummary): void => {
    onClose?.();
    setSelectedJuzId(juz.number);
    const page = JUZ_START_PAGES[juz.number - 1] ?? 1;
    setSelectedPageId(page);
    const chap = getSurahByPage(page, chapters);
    if (chap) setSelectedSurahId(chap.id);
    rememberScroll();
  };

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={juzs as JuzSummary[]}
      fixedItemHeight={88}
      computeItemKey={(_, juz) => juz.number}
      {...(scrollParent ? { customScrollParent: scrollParent } : {})}
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
