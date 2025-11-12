'use client';

import { useCallback } from 'react';

import { VerseActionItem } from '@/app/shared/verse-actions/types';

import {
  createBookmarkAction,
  createGoToVerseAction,
  createPlayPauseAction,
  createShareAction,
  createTafsirAction,
  createAddToPlanAction,
} from './actionCreators';

interface UseVerseActionsParams {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  showRemove: boolean;
  verseKey: string;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onAddToPlan: () => void;
  onNavigateToVerse?: () => void;
  onClose: () => void;
}

export function useVerseActions({
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  showRemove,
  verseKey,
  onPlayPause,
  onBookmark,
  onShare,
  onAddToPlan,
  onNavigateToVerse,
  onClose,
}: UseVerseActionsParams): VerseActionItem[] {
  const handleAction = useCallback(
    (action: () => void) => {
      action();
      onClose();
    },
    [onClose]
  );

  const handlePlayPause = useCallback(() => handleAction(onPlayPause), [handleAction, onPlayPause]);

  const handleBookmark = useCallback(() => handleAction(onBookmark), [handleAction, onBookmark]);

  const handleShare = useCallback(() => handleAction(onShare), [handleAction, onShare]);

  const handleAddToPlan = useCallback(() => handleAction(onAddToPlan), [handleAction, onAddToPlan]);

  const handleGoToVerse = useCallback(() => {
    if (onNavigateToVerse) {
      handleAction(onNavigateToVerse);
    }
  }, [handleAction, onNavigateToVerse]);

  return [
    createPlayPauseAction({
      isPlaying,
      isLoadingAudio,
      onClick: handlePlayPause,
    }),
    createTafsirAction({ verseKey }),
    ...(onNavigateToVerse ? [createGoToVerseAction({ onClick: handleGoToVerse })] : []),
    createBookmarkAction({
      isBookmarked,
      showRemove,
      onClick: handleBookmark,
    }),
    createShareAction({ onClick: handleShare }),
    createAddToPlanAction({ onClick: handleAddToPlan }),
  ];
}
