import { ReactElement, createElement } from 'react';

import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
  CalendarIcon,
  GoToIcon,
} from '@/app/shared/icons';
import { Spinner } from '@/app/shared/Spinner';
import { VerseActionItem } from '@/app/shared/verse-actions/types';

interface CreatePlayPauseActionParams {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onClick: () => void;
}

export function createPlayPauseAction({
  isPlaying,
  isLoadingAudio,
  onClick,
}: CreatePlayPauseActionParams): VerseActionItem {
  const icon: ReactElement = isLoadingAudio
    ? createElement(Spinner, { className: 'h-5 w-5 text-accent' })
    : isPlaying
      ? createElement(PauseIcon, { size: 20 })
      : createElement(PlayIcon, { size: 20 });

  return {
    label: isPlaying ? 'Pause Audio' : 'Play Audio',
    icon,
    onClick,
    active: isPlaying,
  };
}

interface CreateBookmarkActionParams {
  isBookmarked: boolean;
  showRemove: boolean;
  onClick: () => void;
}

export function createBookmarkAction({
  isBookmarked,
  showRemove,
  onClick,
}: CreateBookmarkActionParams): VerseActionItem {
  const icon: ReactElement =
    isBookmarked || showRemove
      ? createElement(BookmarkIcon, { size: 20 })
      : createElement(BookmarkOutlineIcon, { size: 20 });

  return {
    label: showRemove ? 'Remove Bookmark' : isBookmarked ? 'Remove Bookmark' : 'Add Bookmark',
    icon,
    onClick,
    active: isBookmarked || showRemove,
  };
}

interface CreateTafsirActionParams {
  verseKey: string;
}

export function createTafsirAction({ verseKey }: CreateTafsirActionParams): VerseActionItem {
  return {
    label: 'View Tafsir',
    icon: createElement(BookReaderIcon, { size: 20 }),
    onClick: () => {},
    href: `/tafsir/${verseKey.replace(':', '/')}`,
  };
}

interface CreateGoToVerseActionParams {
  onClick: () => void;
}

export function createGoToVerseAction({ onClick }: CreateGoToVerseActionParams): VerseActionItem {
  return {
    label: 'Go to Verse',
    icon: createElement(GoToIcon, { size: 20 }),
    onClick,
  };
}

interface CreateShareActionParams {
  onClick: () => void;
}

export function createShareAction({ onClick }: CreateShareActionParams): VerseActionItem {
  return {
    label: 'Share',
    icon: createElement(ShareIcon, { size: 20 }),
    onClick,
  };
}

interface CreateAddToPlanActionParams {
  onClick: () => void;
}

export function createAddToPlanAction({ onClick }: CreateAddToPlanActionParams): VerseActionItem {
  return {
    label: 'Add to Plan',
    icon: createElement(CalendarIcon, { size: 20 }),
    onClick,
  };
}
