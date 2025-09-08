'use client';

import Link from 'next/link';
import { useState } from 'react';

import { BookmarkModal } from '@/app/shared/components/BookmarkModal';
import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
} from '@/app/shared/icons';
import { Spinner } from '@/app/shared/Spinner';
import { VerseActionsProps } from '@/app/shared/verse-actions/types';
import { defaultShare } from '@/app/shared/verse-actions/utils';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

type ActionHandler = () => void;

const PlayPauseButton = ({
  isPlaying,
  isLoadingAudio,
  onPlayPause,
}: {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onPlayPause: ActionHandler;
}): React.JSX.Element => (
  <button
    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
    onClick={onPlayPause}
    title="Play/Pause"
    className={cn(
      'p-1.5 rounded-full hover:bg-accent/10 transition',
      isPlaying ? 'text-accent' : 'hover:text-accent',
      touchClasses.focus
    )}
  >
    {isLoadingAudio ? (
      <Spinner className="h-4 w-4 text-accent" />
    ) : isPlaying ? (
      <PauseIcon size={18} />
    ) : (
      <PlayIcon size={18} />
    )}
  </button>
);

const TafsirLink = ({ verseKey }: { verseKey: string }): React.JSX.Element => (
  <Link
    href={`/tafsir/${verseKey.replace(':', '/')}`}
    aria-label="View tafsir"
    title="Tafsir"
    className={cn(
      'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
      touchClasses.focus
    )}
  >
    <BookReaderIcon size={18} />
  </Link>
);

const NavigateToVerseLink = ({
  onNavigateToVerse,
}: {
  onNavigateToVerse?: ActionHandler;
}): React.JSX.Element | null => {
  if (!onNavigateToVerse) return null;
  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onNavigateToVerse();
      }}
      aria-label="Go to verse"
      title="Go to verse"
      className={cn(
        'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
        touchClasses.focus
      )}
    >
      <BookReaderIcon size={18} />
    </Link>
  );
};

const BookmarkButton = ({
  isBookmarked,
  showRemove,
  onClick,
}: {
  isBookmarked: boolean;
  showRemove: boolean;
  onClick: ActionHandler;
}): React.JSX.Element => (
  <button
    aria-label={showRemove ? 'Remove bookmark' : isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    title={showRemove ? 'Remove bookmark' : 'Bookmark'}
    onClick={onClick}
    className={cn(
      'p-1.5 rounded-full hover:bg-accent/10 transition',
      isBookmarked || showRemove ? 'text-accent' : 'hover:text-accent',
      touchClasses.focus
    )}
  >
    {isBookmarked || showRemove ? <BookmarkIcon size={18} /> : <BookmarkOutlineIcon size={18} />}
  </button>
);

const ShareButton = ({ onShare }: { onShare: ActionHandler }): React.JSX.Element => (
  <button
    aria-label="Share"
    title="Share"
    onClick={onShare}
    className={cn(
      'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
      touchClasses.focus
    )}
  >
    <ShareIcon size={18} />
  </button>
);

export const DesktopVerseActions = ({
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
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const handleShare = onShare || defaultShare;
  const handleBookmarkClick = (): void => {
    if (showRemove && onBookmark) {
      onBookmark();
    } else {
      setIsBookmarkModalOpen(true);
    }
  };

  return (
    <div className={cn('text-center space-y-2 flex-shrink-0', className)}>
      <p className="font-semibold text-accent text-sm">{verseKey}</p>
      <div className="flex flex-col items-center space-y-1 text-muted">
        <PlayPauseButton
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          onPlayPause={onPlayPause}
        />
        <TafsirLink verseKey={verseKey} />
        <NavigateToVerseLink onNavigateToVerse={onNavigateToVerse} />
        <BookmarkButton
          isBookmarked={Boolean(isBookmarked)}
          showRemove={showRemove}
          onClick={handleBookmarkClick}
        />
        <ShareButton onShare={handleShare} />
      </div>

      {/* BookmarkModal */}
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        verseId={verseId || verseKey}
        verseKey={verseKey}
      />
    </div>
  );
};
