'use client';

import Link from 'next/link';
import { useState } from 'react';

import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

import { BookmarkModal } from '../components/BookmarkModal';
import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
} from '../icons';
import { Spinner } from '../Spinner';
import { VerseActionsProps } from './types';
import { defaultShare } from './utils';

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

  const handleBookmarkClick = () => {
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

        {onNavigateToVerse && (
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
        )}

        <button
          aria-label={
            showRemove ? 'Remove bookmark' : isBookmarked ? 'Remove bookmark' : 'Add bookmark'
          }
          title={showRemove ? 'Remove bookmark' : 'Bookmark'}
          onClick={handleBookmarkClick}
          className={cn(
            'p-1.5 rounded-full hover:bg-accent/10 transition',
            isBookmarked || showRemove ? 'text-accent' : 'hover:text-accent',
            touchClasses.focus
          )}
        >
          {isBookmarked || showRemove ? (
            <BookmarkIcon size={18} />
          ) : (
            <BookmarkOutlineIcon size={18} />
          )}
        </button>

        <button
          aria-label="Share"
          title="Share"
          onClick={handleShare}
          className={cn(
            'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
            touchClasses.focus
          )}
        >
          <ShareIcon size={18} />
        </button>
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
