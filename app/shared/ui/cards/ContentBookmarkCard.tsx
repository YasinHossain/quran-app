'use client';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { parseVerseKey } from '@/lib/utils/verse';

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
  const { t, i18n } = useTranslation();
  const { surahNumber } = bookmark.verseKey
    ? parseVerseKey(bookmark.verseKey)
    : { surahNumber: undefined };
  const localizedVerseKey = bookmark.verseKey
    ? localizeDigits(bookmark.verseKey, i18n.language)
    : '';
  const fallbackSurahName = bookmark.surahName ?? '';
  const localizedSurahName =
    typeof surahNumber === 'number'
      ? t(`surah_names.${surahNumber}`, fallbackSurahName)
      : fallbackSurahName;
  const ariaLabel = t('bookmark_card_aria', {
    verseKey: localizedVerseKey,
    surah: localizedSurahName,
    defaultValue: `Bookmark for verse ${localizedVerseKey} from ${localizedSurahName}`,
  });

  const { handleCardClick, headerProps, previewProps } = useContentBookmarkCard({
    bookmark,
    isPlaying,
    isLoadingAudio,
    ...(onPlayPause ? { onPlayPause } : {}),
    isBookmarked,
    ...(onBookmark ? { onBookmark } : {}),
    ...(onNavigateToVerse ? { onNavigateToVerse } : {}),
    settings,
    ...(onClick ? { onClick } : {}),
  });

  return (
    <BaseCard
      variant="bookmark"
      animation="bookmark"
      onClick={handleCardClick}
      role="article"
      aria-label={ariaLabel}
      {...props}
    >
      <Header {...headerProps} />
      <VersePreview {...previewProps} />
    </BaseCard>
  );
});
