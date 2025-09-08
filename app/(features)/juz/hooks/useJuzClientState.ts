import { useState } from 'react';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

import { useCoverAndTrack } from '@/app/shared/hooks/useCoverAndTrack';
import { useSelectedNames } from '@/app/shared/hooks/useSelectedNames';

import { useJuzData } from './useJuzData';

export function useJuzClientState(juzId: string, t: (key: string) => string) {
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const { isHidden } = useHeaderVisibility();

  const {
    juz,
    juzError,
    isLoading,
    error,
    verses,
    isValidating,
    isReachingEnd,
    loadMoreRef,
    translationOptions,
    wordLanguageOptions,
    settings,
    activeVerse,
    reciter,
    isPlayerVisible,
    handleNext,
    handlePrev,
  } = useJuzData(juzId);

  const { selectedTranslationName, selectedWordLanguageName } = useSelectedNames({
    settings,
    translationOptions,
    wordLanguageOptions,
    t,
  });

  const { track } = useCoverAndTrack(activeVerse, reciter);

  const contentProps = {
    juzId,
    isLoading,
    error,
    juzError,
    juz,
    verses,
    loadMoreRef,
    isValidating,
    isReachingEnd,
    t,
  } as const;

  const settingsProps = {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } as const;

  const playerBarProps = {
    isHidden,
    track,
    activeVerseExists: !!activeVerse,
    isPlayerVisible,
    onNext: handleNext,
    onPrev: handlePrev,
  } as const;

  return { isHidden, contentProps, settingsProps, playerBarProps } as const;
}

