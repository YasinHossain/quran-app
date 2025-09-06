'use client';
import React, { memo, useCallback } from 'react';

import { BaseCard, BaseCardProps } from '../BaseCard';
import { Header } from './content-bookmark/Header';
import { VersePreview } from './content-bookmark/VersePreview';
interface BookmarkData {
  verseKey?: string;
  verseText?: string;
  translation?: string;
  surahName?: string;
  createdAt: number;
  verseId: string | number;
  verseApiId?: number;
}
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
  const { verseKey, verseText, translation, surahName, createdAt } = bookmark;
  const { arabicFontFace = 'font-amiri', arabicFontSize = 18, tajweed = false } = settings;
  const handleCardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      onNavigateToVerse?.();
      onClick?.(e);
    },
    [onNavigateToVerse, onClick]
  );
  return (
    <BaseCard
      variant="bookmark"
      animation="bookmark"
      onClick={handleCardClick}
      role="article"
      aria-label={`Bookmark for verse ${verseKey} from ${surahName}`}
      {...props}
    >
      <Header
        verseKey={verseKey}
        surahName={surahName}
        createdAt={createdAt}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isBookmarked={isBookmarked}
        onPlayPause={onPlayPause}
        onBookmark={onBookmark}
        onNavigateToVerse={onNavigateToVerse}
      />
      <VersePreview
        verseText={verseText}
        translation={translation}
        arabicFontFace={arabicFontFace}
        arabicFontSize={arabicFontSize}
        tajweed={tajweed}
      />
    </BaseCard>
  );
});
