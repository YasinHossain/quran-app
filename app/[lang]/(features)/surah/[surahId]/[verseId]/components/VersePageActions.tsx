'use client';

import { useCallback, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { BookmarkModal } from '@/app/shared/components/BookmarkModal';
import { ShareIcon } from '@/app/shared/icons';
import { AppAudioPlayer } from '@/app/shared/player/AppAudioPlayer';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { BookmarkButton } from '@/app/shared/verse-actions/components/BookmarkButton';
import { PlayPauseButton } from '@/app/shared/verse-actions/components/PlayPauseButton';
import { defaultShare } from '@/app/shared/verse-actions/utils';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import type { Verse } from '@/types';

interface VersePageActionsProps {
  verseId: number;
  verseKey: string;
  arabic: string;
  shareLabel: string;
}

/**
 * Client island of the verse page: play (with the shared audio player), bookmark and share.
 * Buttons keep a fixed size in every state, so hydration never shifts the server layout.
 */
export function VersePageActions({
  verseId,
  verseKey,
  arabic,
  shareLabel,
}: VersePageActionsProps): React.JSX.Element {
  const {
    playingId,
    loadingId,
    setPlayingId,
    setLoadingId,
    setActiveVerse,
    activeVerse,
    audioRef,
    setIsPlaying,
    openPlayer,
    reciter,
    isPlayerVisible,
  } = useAudio();
  const { isPinned } = useBookmarks();
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  // The player only needs the id and key; words are not loaded on this page.
  const verse = useMemo<Verse>(
    () => ({ id: verseId, verse_key: verseKey, text_uthmani: arabic, words: [] }),
    [verseId, verseKey, arabic]
  );
  const isPlaying = playingId === verseId;

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setPlayingId(null);
      setLoadingId(null);
      setIsPlaying(false);
      return;
    }
    setActiveVerse(verse);
    setPlayingId(verseId);
    setLoadingId(verseId);
    setIsPlaying(true);
    openPlayer();
  }, [
    isPlaying,
    audioRef,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    setActiveVerse,
    verse,
    verseId,
    openPlayer,
  ]);

  return (
    <div className="flex items-center gap-1 text-muted">
      <PlayPauseButton
        isPlaying={isPlaying}
        isLoadingAudio={loadingId === verseId}
        onPlayPause={handlePlayPause}
      />
      <BookmarkButton
        isBookmarked={isPinned(String(verseId)) || isPinned(verseKey)}
        showRemove={false}
        onClick={() => setIsBookmarkModalOpen(true)}
      />
      <button
        type="button"
        aria-label={shareLabel}
        title={shareLabel}
        onClick={() => defaultShare(verseKey)}
        className={cn(
          'flex items-center justify-center rounded-full p-1.5 transition hover:bg-interactive-hover hover:text-accent',
          touchClasses.target,
          touchClasses.focus
        )}
      >
        <ShareIcon size={18} />
      </button>
      {isBookmarkModalOpen ? (
        <BookmarkModal
          isOpen
          onClose={() => setIsBookmarkModalOpen(false)}
          verseId={String(verseId)}
          verseKey={verseKey}
        />
      ) : null}
      <AppAudioPlayer activeVerse={activeVerse} reciter={reciter} isVisible={isPlayerVisible} />
    </div>
  );
}
