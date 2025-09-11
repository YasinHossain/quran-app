'use client';
import React, { memo } from 'react';

import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';

import { Header } from './content-bookmark/Header';
import { BookmarkData, useContentBookmarkCard } from './content-bookmark/useContentBookmarkCard';
import { VersePreview } from './content-bookmark/VersePreview';

interface ContentBookmarkCardProps extends Omit<BaseCardProps, 'children'> {
  bookmark: BookmarkData;
  isPlaying?: boolean;
  isLoadingAudio?: boolean;
  onPlayPause?: () => void;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onNavigateToVerse?: () => void;
  settings?: {
    arabicFontFace?: string;
    arabicFontSize?: number;
    tajweed?: boolean;
  };
}

export const ContentBookmarkCard = memo(function ContentBookmarkCard({
  bookmark,
  isPlaying = false,
  isLoadingAudio = false,
  onPlayPause,
  isBookmarked = true,
  onBookmark,
  onNavigateToVerse,
  settings = {},
  onClick,
  ...props
}: ContentBookmarkCardProps) {
  const { handleCardClick, headerProps, previewProps } = useContentBookmarkCard({
    bookmark,
    isPlaying,
    isLoadingAudio,
    onPlayPause,
    isBookmarked,
    onBookmark,
    onNavigateToVerse,
    settings,
    onClick,
  });

  return (
    <BaseCard
      variant="bookmark"
      animation="bookmark"
      onClick={handleCardClick}
      role="article"
      aria-label={`Bookmark for verse ${bookmark.verseKey} from ${bookmark.surahName}`}
      {...props}
    >
      <Header {...headerProps} />
      <VersePreview {...previewProps} />
    </BaseCard>
  );
});
