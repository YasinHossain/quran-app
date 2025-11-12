'use client';

import { BookmarkModal } from '@/app/shared/components/BookmarkModal';

import { VerseActionTrigger } from './components/VerseActionTrigger';
import { useMobileVerseActionsState } from './hooks/useMobileVerseActionsState';
import { MobileBottomSheet } from './MobileBottomSheet';
import { VerseActionsProps } from './types';

import type { ComponentProps } from 'react';

const buildStateConfig = ({
  onShare,
  onBookmark,
  showRemove,
  onAddToPlan,
}: {
  onShare?: VerseActionsProps['onShare'];
  onBookmark?: VerseActionsProps['onBookmark'];
  showRemove: boolean;
  onAddToPlan?: VerseActionsProps['onAddToPlan'];
}): Parameters<typeof useMobileVerseActionsState>[0] => {
  const config: Parameters<typeof useMobileVerseActionsState>[0] = { showRemove };
  if (onShare) config.onShare = onShare;
  if (onBookmark) config.onBookmark = onBookmark;
  if (onAddToPlan) config.onAddToPlan = onAddToPlan;
  return config;
};

const createSheetProps = ({
  state,
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  showRemove,
  onNavigateToVerse,
}: {
  state: ReturnType<typeof useMobileVerseActionsState>;
  verseKey: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: VerseActionsProps['onPlayPause'];
  showRemove: boolean;
  onNavigateToVerse: VerseActionsProps['onNavigateToVerse'];
}): ComponentProps<typeof MobileBottomSheet> => ({
  isOpen: state.isBottomSheetOpen,
  onClose: state.closeBottomSheet,
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark: state.handleBookmarkClick,
  onShare: state.handleShare,
  onAddToPlan: state.handleAddToPlan,
  showRemove,
  ...(onNavigateToVerse ? { onNavigateToVerse } : {}),
});

export function MobileVerseActions({
  verseKey,
  verseId,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  onNavigateToVerse,
  onAddToPlan,
  showRemove = false,
  className = '',
}: VerseActionsProps): React.JSX.Element {
  const state = useMobileVerseActionsState(
    buildStateConfig({ onShare, onBookmark, onAddToPlan, showRemove })
  );
  const sheetProps = createSheetProps({
    state,
    verseKey,
    isPlaying,
    isLoadingAudio,
    isBookmarked,
    onPlayPause,
    showRemove,
    onNavigateToVerse,
  });

  return (
    <>
      <VerseActionTrigger
        verseKey={verseKey}
        onOpen={state.openBottomSheet}
        className={className}
      />
      <MobileBottomSheet {...sheetProps} />
      <BookmarkModal
        isOpen={state.isBookmarkModalOpen}
        onClose={state.closeBookmarkModal}
        verseId={verseId || verseKey}
        verseKey={verseKey}
      />
    </>
  );
}
