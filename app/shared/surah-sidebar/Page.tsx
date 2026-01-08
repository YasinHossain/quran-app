'use client';

import React, { memo, useCallback } from 'react';

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
  onClose?: (() => void) | undefined;
}

interface PageItemProps {
  page: number;
  isActive: boolean;
  href: string;
  onNavigate: () => void;
}

/**
 * Memoized individual Page item to prevent re-renders when other pages change.
 * This is especially important for Pages list which has 604 items.
 */
const PageItem = memo(function PageItem({
  page,
  isActive,
  href,
  onNavigate,
}: PageItemProps): React.JSX.Element {
  return (
    <li style={{ contain: 'layout style' }}>
      <PageNavigationCard
        href={href}
        scroll={false}
        data-active={isActive}
        isActive={isActive}
        content={{
          id: page,
          title: `Page ${page}`,
        }}
        onNavigate={onNavigate}
      />
    </li>
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
  onClose,
}: Props): React.JSX.Element => {
  const { getPageHref, goToPage } = useNavigationTargets();

  // Create a stable callback factory for navigation handlers
  const createNavigateHandler = useCallback(
    (p: number) => () => {
      onClose?.();
      setSelectedPageId(p);
      setSelectedJuzId(getJuzByPage(p));
      const chap = getSurahByPage(p, chapters);
      if (chap) setSelectedSurahId(chap.id);
      rememberScroll();
      goToPage(p);
    },
    [
      onClose,
      setSelectedPageId,
      setSelectedJuzId,
      setSelectedSurahId,
      chapters,
      rememberScroll,
      goToPage,
    ]
  );

  return (
    <ul className="space-y-2">
      {pages.map((p) => {
        const isActive = p === selectedPageId;
        return (
          <PageItem
            key={p}
            page={p}
            isActive={isActive}
            href={getPageHref(p)}
            onNavigate={createNavigateHandler(p)}
          />
        );
      })}
    </ul>
  );
};
