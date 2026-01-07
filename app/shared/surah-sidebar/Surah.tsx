import { memo, useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

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
  scrollParent?: HTMLElement;
  isTafsirPath: boolean;
  isMushafMode: boolean;
  onClose?: (() => void) | undefined;
}

interface SurahItemProps {
  chapter: Chapter;
  isActive: boolean;
  href: string;
  onNavigate: (chapter: Chapter) => void;
}

const SurahItem = memo(function SurahItem({
  chapter,
  isActive,
  href,
  onNavigate,
}: SurahItemProps) {
  return (
    <div className="pb-2">
      <SurahNavigationCard
        href={href}
        prefetch={false}
        scroll={false}
        data-active={isActive}
        isActive={isActive}
        content={{
          id: chapter.id,
          title: chapter.name_simple,
          subtitle: `${chapter.verses_count} verses`,
          arabic: chapter.name_arabic,
        }}
        onNavigate={() => onNavigate(chapter)}
      />
    </div>
  );
});

export const Surah = ({
  chapters,
  selectedSurahId,
  setSelectedSurahId,
  setSelectedPageId,
  setSelectedJuzId,
  rememberScroll,
  scrollParent,
  isTafsirPath,
  isMushafMode,
  onClose,
}: Props): React.JSX.Element => {
  const { getSurahHref } = useNavigationTargets();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Note: Scroll centering is handled by the parent useScrollCentering hook
  // which uses [data-active] attributes and scrollIntoView for consistency

  const handleNavigate = (chapter: Chapter): void => {
    onClose?.();
    setSelectedSurahId(chapter.id);
    const firstPage = chapter.pages?.[0] ?? 1;
    setSelectedPageId(firstPage);
    setSelectedJuzId(getJuzByPage(firstPage));
    rememberScroll();
  };

  const getHref = (chapter: Chapter): string => {
    const surahHref = getSurahHref(chapter.id);
    if (isTafsirPath) return buildTafsirRoute(chapter.id, 1);
    if (isMushafMode) return `${surahHref}?view=mushaf`;
    return surahHref;
  };

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={chapters as Chapter[]}
      fixedItemHeight={88}
      computeItemKey={(_, chapter) => chapter.id}
      {...(scrollParent ? { customScrollParent: scrollParent } : {})}
      style={{ height: '100%' }}
      itemContent={(_, chapter) => (
        <SurahItem
          chapter={chapter}
          isActive={chapter.id === selectedSurahId}
          href={getHref(chapter)}
          onNavigate={handleNavigate}
        />
      )}
    />
  );
};
