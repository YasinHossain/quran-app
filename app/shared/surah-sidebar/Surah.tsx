'use client';

import { useRouter } from 'next/navigation';
import React, { memo, useCallback } from 'react';

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
  isMushafMode: boolean;
  onClose?: (() => void) | undefined;
}

interface SurahItemProps {
  chapter: Chapter;
  isActive: boolean;
  href: string;
  onNavigate: () => void;
}

/**
 * Memoized individual Surah item to prevent re-renders when other surahs change.
 * Only re-renders when its own props change.
 */
const SurahItem = memo(function SurahItem({
  chapter,
  isActive,
  href,
  onNavigate,
}: SurahItemProps): React.JSX.Element {
  return (
    <li style={{ contain: 'layout style' }}>
      <SurahNavigationCard
        href={href}
        scroll={false}
        data-active={isActive}
        isActive={isActive}
        content={{
          id: chapter.id,
          title: chapter.name_simple,
          subtitle: `${chapter.verses_count} verses`,
          arabic: chapter.name_arabic,
        }}
        onNavigate={onNavigate}
      />
    </li>
  );
});

export const Surah = ({
  chapters,
  selectedSurahId,
  setSelectedSurahId,
  setSelectedPageId,
  setSelectedJuzId,
  rememberScroll,
  isTafsirPath,
  isMushafMode,
  onClose,
}: Props): React.JSX.Element => {
  const { getSurahHref, goToSurah } = useNavigationTargets();
  const router = useRouter();

  // Create a stable callback factory for navigation handlers
  const createNavigateHandler = useCallback(
    (chapter: Chapter, surahHref: string) => () => {
      onClose?.();
      setSelectedSurahId(chapter.id);
      const firstPage = chapter.pages?.[0] ?? 1;
      setSelectedPageId(firstPage);
      setSelectedJuzId(getJuzByPage(firstPage));
      rememberScroll();
      if (!isTafsirPath) {
        if (isMushafMode) {
          router.push(`${surahHref}?view=mushaf`);
        } else {
          goToSurah(chapter.id);
        }
      }
    },
    [
      onClose,
      setSelectedSurahId,
      setSelectedPageId,
      setSelectedJuzId,
      rememberScroll,
      isTafsirPath,
      isMushafMode,
      router,
      goToSurah,
    ]
  );

  return (
    <ul className="space-y-2">
      {chapters.map((chapter) => {
        const isActive = chapter.id === selectedSurahId;
        const surahHref = getSurahHref(chapter.id);
        const href = isTafsirPath
          ? buildTafsirRoute(chapter.id, 1)
          : isMushafMode
            ? `${surahHref}?view=mushaf`
            : surahHref;

        return (
          <SurahItem
            key={chapter.id}
            chapter={chapter}
            isActive={isActive}
            href={href}
            onNavigate={createNavigateHandler(chapter, surahHref)}
          />
        );
      })}
    </ul>
  );
};
