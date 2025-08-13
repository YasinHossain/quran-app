'use client';
import { FaPlay, FaPause, FaBookmark, FaRegBookmark, FaShare } from './SvgIcons';
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
      <p className="font-semibold text-teal-600 text-sm">{verseKey}</p>
      <div className="flex flex-col items-center space-y-1 text-gray-400 dark:text-gray-500">
        <button
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          onClick={onPlayPause}
          title="Play/Pause"
          className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isPlaying ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
        >
          {isLoadingAudio ? (
            <Spinner className="h-4 w-4 text-teal-600" />
          ) : isPlaying ? (
            <FaPause size={18} />
          ) : (
            <FaPlay size={18} />
          )}
        </button>
        <button
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          title="Bookmark"
          onClick={onBookmark}
          className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isBookmarked ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
        >
          {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
        </button>
        <button
          aria-label="Share"
          title="Share"
          onClick={handleShare}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <FaShare size={18} />
        </button>
      </div>
    </div>
  );
};

export default VerseActions;
