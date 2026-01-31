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
import { VerseActionItem } from '@/app/shared/verse-actions/types';

import type { TFunction } from 'i18next';

interface CreatePlayPauseActionParams {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onClick: () => void;
  t: TFunction;
}

export function createPlayPauseAction({
  isPlaying,
  onClick,
  t,
}: CreatePlayPauseActionParams): VerseActionItem {
  const icon: ReactElement = isPlaying
    ? createElement(PauseIcon, { size: 20 })
    : createElement(PlayIcon, { size: 20 });

  return {
    label: isPlaying ? t('pause_audio') : t('play_audio'),
    icon,
    onClick,
    active: isPlaying,
  };
}

interface CreateBookmarkActionParams {
  isBookmarked: boolean;
  showRemove: boolean;
  onClick: () => void;
  t: TFunction;
}

export function createBookmarkAction({
  isBookmarked,
  showRemove,
  onClick,
  t,
}: CreateBookmarkActionParams): VerseActionItem {
  const icon: ReactElement =
    isBookmarked || showRemove
      ? createElement(BookmarkIcon, { size: 20 })
      : createElement(BookmarkOutlineIcon, { size: 20 });

  return {
    label: showRemove ? t('remove_bookmark') : t('pin_or_bookmark'),
    icon,
    onClick,
    active: isBookmarked || showRemove,
  };
}

interface CreateTafsirActionParams {
  verseKey: string;
  t: TFunction;
}

export function createTafsirAction({ verseKey, t }: CreateTafsirActionParams): VerseActionItem {
  return {
    label: t('view_tafsir', { defaultValue: 'View tafsir' }),
    icon: createElement(BookReaderIcon, { size: 20 }),
    onClick: () => {},
    href: `/tafsir/${verseKey.replace(':', '/')}`,
  };
}

interface CreateGoToVerseActionParams {
  onClick: () => void;
  t: TFunction;
}

export function createGoToVerseAction({
  onClick,
  t,
}: CreateGoToVerseActionParams): VerseActionItem {
  return {
    label: t('go_to_verse'),
    icon: createElement(GoToIcon, { size: 20 }),
    onClick,
  };
}

interface CreateShareActionParams {
  onClick: () => void;
  t: TFunction;
}

export function createShareAction({ onClick, t }: CreateShareActionParams): VerseActionItem {
  return {
    label: t('share'),
    icon: createElement(ShareIcon, { size: 20 }),
    onClick,
  };
}

interface CreateAddToPlanActionParams {
  onClick: () => void;
  t: TFunction;
}

export function createAddToPlanAction({
  onClick,
  t,
}: CreateAddToPlanActionParams): VerseActionItem {
  return {
    label: t('add_to_plan'),
    icon: createElement(CalendarIcon, { size: 20 }),
    onClick,
  };
}
