'use client';

import React, { memo, useCallback, startTransition } from 'react';

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
        prefetch={true}
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
  const { getPageHref } = useNavigationTargets();

  // Create a stable callback factory for navigation handlers
  // State updates are wrapped in startTransition to avoid blocking navigation
  // The Link component handles actual navigation - no goToPage needed
  const createNavigateHandler = useCallback(
    (p: number) => () => {
      // Close sidebar immediately for instant feedback
      onClose?.();

      // Use startTransition for non-urgent state updates
      // This allows navigation to start immediately without waiting for re-renders
      startTransition(() => {
        setSelectedPageId(p);
        setSelectedJuzId(getJuzByPage(p));
        const chap = getSurahByPage(p, chapters);
        if (chap) setSelectedSurahId(chap.id);
        rememberScroll();
      });
      // Navigation is handled by the Link component's href - no goToPage needed
    },
    [onClose, setSelectedPageId, setSelectedJuzId, setSelectedSurahId, chapters, rememberScroll]
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
