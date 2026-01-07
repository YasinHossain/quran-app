import { memo, useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { useNavigationTargets } from '@/app/shared/navigation/hooks/useNavigationTargets';
import { PageNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { getJuzByPage, getSurahByPage } from '@/lib/utils/surah-navigation';

import type { Chapter } from '@/types';

interface Props {
  pages: ReadonlyArray<number>;
  chapters: ReadonlyArray<Chapter>;
  selectedPageId: number | null;
  setSelectedPageId: (id: number) => void;
  setSelectedJuzId: (id: number) => void;
  setSelectedSurahId: (id: number) => void;
  rememberScroll: () => void;
  scrollParent?: HTMLElement;
  onClose?: (() => void) | undefined;
}

interface PageItemProps {
  page: number;
  isActive: boolean;
  getPageHref: (p: number) => string;
  onNavigate: (p: number) => void;
}

const PageItem = memo(function PageItem({
  page,
  isActive,
  getPageHref,
  onNavigate,
}: PageItemProps) {
  return (
    <div className="pb-2">
      <PageNavigationCard
        href={getPageHref(page)}
        prefetch={false}
        scroll={false}
        data-active={isActive}
        isActive={isActive}
        content={{
          id: page,
          title: `Page ${page}`,
        }}
        onNavigate={() => onNavigate(page)}
      />
    </div>
  );
});

export const Page = ({
  pages,
  chapters,
  selectedPageId,
  setSelectedPageId,
  setSelectedJuzId,
  setSelectedSurahId,
  rememberScroll,
  scrollParent,
  onClose,
}: Props): React.JSX.Element => {
  const { getPageHref } = useNavigationTargets();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Note: Scroll centering is handled by the parent useScrollCentering hook
  // which uses [data-active] attributes and scrollIntoView for consistency

  const handleNavigate = (p: number): void => {
    onClose?.();
    setSelectedPageId(p);
    setSelectedJuzId(getJuzByPage(p));
    const chap = getSurahByPage(p, chapters);
    if (chap) setSelectedSurahId(chap.id);
    rememberScroll();
  };

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={pages as number[]}
      fixedItemHeight={88}
      computeItemKey={(_, page) => page}
      {...(scrollParent ? { customScrollParent: scrollParent } : {})}
      style={{ height: '100%' }}
      itemContent={(_, page) => (
        <PageItem
          page={page}
          isActive={page === selectedPageId}
          getPageHref={getPageHref}
          onNavigate={handleNavigate}
        />
      )}
    />
  );
};
