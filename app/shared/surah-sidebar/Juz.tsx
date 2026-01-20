'use client';

import React, { memo, useCallback, startTransition } from 'react';

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
  href: string;
  onNavigate: () => void;
}

/**
 * Memoized individual Juz item to prevent re-renders when other juzs change.
 */
const JuzItem = memo(function JuzItem({
  juz,
  isActive,
  href,
  onNavigate,
}: JuzItemProps): React.JSX.Element {
  return (
    <li style={{ contain: 'layout style' }}>
      <JuzNavigationCard
        href={href}
        scroll={false}
        prefetch={true}
        data-active={isActive}
        isActive={isActive}
        content={{
          id: juz.number,
          title: `Juz ${juz.number}`,
          subtitle: juz.surahRange,
        }}
        onNavigate={onNavigate}
      />
    </li>
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
  const { getJuzHref } = useNavigationTargets();

  // Create a stable callback factory for navigation handlers
  // State updates are wrapped in startTransition to avoid blocking navigation
  // The Link component handles actual navigation - no goToJuz needed
  const createNavigateHandler = useCallback(
    (juz: JuzSummary) => () => {
      // Close sidebar immediately for instant feedback
      onClose?.();

      // Use startTransition for non-urgent state updates
      // This allows navigation to start immediately without waiting for re-renders
      startTransition(() => {
        setSelectedJuzId(juz.number);
        const page = JUZ_START_PAGES[juz.number - 1] ?? 1;
        setSelectedPageId(page);
        const chap = getSurahByPage(page, chapters);
        if (chap) setSelectedSurahId(chap.id);
        rememberScroll();
      });
      // Navigation is handled by the Link component's href - no goToJuz needed
    },
    [onClose, setSelectedJuzId, setSelectedPageId, setSelectedSurahId, chapters, rememberScroll]
  );

  return (
    <ul className="space-y-2">
      {juzs.map((juz) => {
        const isActive = juz.number === selectedJuzId;
        return (
          <JuzItem
            key={juz.number}
            juz={juz}
            isActive={isActive}
            href={getJuzHref(juz.number)}
            onNavigate={createNavigateHandler(juz)}
          />
        );
      })}
    </ul>
  );
};
