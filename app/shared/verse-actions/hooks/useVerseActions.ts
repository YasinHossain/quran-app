'use client';

import { ReactElement, createElement } from 'react';

import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
} from '../../icons';
import { Spinner } from '../../Spinner';
import { VerseActionItem } from '../types';

interface UseVerseActionsParams {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  showRemove: boolean;
  verseKey: string;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onNavigateToVerse?: () => void;
  handleAction: (action: () => void) => void;
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
  onNavigateToVerse,
  handleAction,
}: UseVerseActionsParams): VerseActionItem[] {
  const playPauseIcon: ReactElement = isLoadingAudio
    ? createElement(Spinner, { className: 'h-5 w-5 text-accent' })
    : isPlaying
    ? createElement(PauseIcon, { size: 20 })
    : createElement(PlayIcon, { size: 20 });

  const bookmarkIcon: ReactElement = isBookmarked || showRemove
    ? createElement(BookmarkIcon, { size: 20 })
    : createElement(BookmarkOutlineIcon, { size: 20 });

  return [
    {
      label: isPlaying ? 'Pause Audio' : 'Play Audio',
      icon: playPauseIcon,
      onClick: () => handleAction(onPlayPause),
      active: isPlaying,
    },
    {
      label: 'View Tafsir',
      icon: createElement(BookReaderIcon, { size: 20 }),
      onClick: () => {},
      href: `/tafsir/${verseKey.replace(':', '/')}`,
    },
    ...(onNavigateToVerse
      ? [
          {
            label: 'Go to Verse',
            icon: createElement(BookReaderIcon, { size: 20 }),
            onClick: () => handleAction(onNavigateToVerse),
          },
        ]
      : []),
    {
      label: showRemove
        ? 'Remove Bookmark'
        : isBookmarked
        ? 'Remove Bookmark'
        : 'Add Bookmark',
      icon: bookmarkIcon,
      onClick: () => handleAction(onBookmark),
      active: isBookmarked || showRemove,
    },
    {
      label: 'Share',
      icon: createElement(ShareIcon, { size: 20 }),
      onClick: () => handleAction(onShare),
    },
  ];
}

