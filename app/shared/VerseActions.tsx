'use client';
import Link from 'next/link';
import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
} from './icons';
import Spinner from './Spinner';

interface VerseActionsProps {
  verseKey: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare?: () => void;
  className?: string;
}

const defaultShare = () => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.share) {
    navigator.share({ title: 'Quran', url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch(() => {});
  }
};

const VerseActions = ({
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  className = '',
}: VerseActionsProps) => {
  const handleShare = onShare || defaultShare;
  return (
    <div className={`text-center space-y-2 flex-shrink-0 ${className}`}>
      <p className="font-semibold text-accent text-sm">{verseKey}</p>
      <div className="flex flex-col items-center space-y-1 text-muted">
        <button
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          onClick={onPlayPause}
          title="Play/Pause"
          className={`p-1.5 rounded-full hover:bg-accent/10 transition ${isPlaying ? 'text-accent' : 'hover:text-accent'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
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
          className="p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <BookReaderIcon size={18} />
        </Link>
        <button
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          title="Bookmark"
          onClick={onBookmark}
          className={`p-1.5 rounded-full hover:bg-accent/10 transition ${isBookmarked ? 'text-accent' : 'hover:text-accent'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
        >
          {isBookmarked ? <BookmarkIcon size={18} /> : <BookmarkOutlineIcon size={18} />}
        </button>
        <button
          aria-label="Share"
          title="Share"
          onClick={handleShare}
          className="p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ShareIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default VerseActions;
