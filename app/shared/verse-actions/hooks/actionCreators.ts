import { ReactElement, createElement } from 'react';

import { i18n } from '@/app/i18n';
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
import { VerseActionItem } from '@/app/shared/verse-actions/types';

interface CreatePlayPauseActionParams {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onClick: () => void;
}

export function createPlayPauseAction({
  isPlaying,
  onClick,
}: CreatePlayPauseActionParams): VerseActionItem {
  const icon: ReactElement = isPlaying
    ? createElement(PauseIcon, { size: 20 })
    : createElement(PlayIcon, { size: 20 });

  return {
    label: isPlaying ? i18n.t('pause_audio') : i18n.t('play_audio'),
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
    label: showRemove ? i18n.t('remove_bookmark') : i18n.t('pin_or_bookmark'),
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
    label: i18n.t('view_tafsir'),
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
    label: i18n.t('go_to_verse'),
    icon: createElement(GoToIcon, { size: 20 }),
    onClick,
  };
}

interface CreateShareActionParams {
  onClick: () => void;
}

export function createShareAction({ onClick }: CreateShareActionParams): VerseActionItem {
  return {
    label: i18n.t('share'),
    icon: createElement(ShareIcon, { size: 20 }),
    onClick,
  };
}

interface CreateAddToPlanActionParams {
  onClick: () => void;
}

export function createAddToPlanAction({ onClick }: CreateAddToPlanActionParams): VerseActionItem {
  return {
    label: i18n.t('add_to_plan'),
    icon: createElement(CalendarIcon, { size: 20 }),
    onClick,
  };
}
