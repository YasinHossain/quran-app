'use client';

import { BookmarkModal } from '@/app/shared/components/BookmarkModal';

import { VerseActionTrigger } from './components/VerseActionTrigger';
import { useMobileVerseActionsState } from './hooks/useMobileVerseActionsState';
import { MobileBottomSheet } from './MobileBottomSheet';
import { VerseActionsProps } from './types';

export const MobileVerseActions = ({
  verseKey,
  verseId,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  onNavigateToVerse,
  showRemove = false,
  className = '',
}: VerseActionsProps): React.JSX.Element => {
  const {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    isBookmarkModalOpen,
    closeBookmarkModal,
    handleBookmarkClick,
    handleShare,
  } = useMobileVerseActionsState({ onShare, onBookmark, showRemove });

  return (
    <>
      <VerseActionTrigger verseKey={verseKey} onOpen={openBottomSheet} className={className} />
      <MobileBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        verseKey={verseKey}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isBookmarked={isBookmarked}
        onPlayPause={onPlayPause}
        onBookmark={handleBookmarkClick}
        onShare={handleShare}
        onNavigateToVerse={onNavigateToVerse}
        showRemove={showRemove}
      />
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={closeBookmarkModal}
        verseId={verseId || verseKey}
        verseKey={verseKey}
      />
    </>
  );
};
