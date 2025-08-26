'use client';

import React, { memo } from 'react';
import { BaseCard, BaseCardProps } from '../BaseCard';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import ResponsiveVerseActions from '@/app/shared/ResponsiveVerseActions';

/**
 * ContentBookmarkCard
 *
 * Maintains the exact visual design and functionality of the current BookmarkCard
 * while using the unified BaseCard system.
 */

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
  // Audio controls
  isPlaying?: boolean;
  isLoadingAudio?: boolean;
  onPlayPause?: () => void;
  // Bookmark management
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onNavigateToVerse?: () => void;
  // Settings
  settings?: {
    arabicFontFace?: string;
    arabicFontSize?: number;
    tajweed?: boolean;
  };
}

// Simple time ago function (preserved from original)
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
  if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`;
  if (weeks > 0) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'Just now';
};

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
  const { verseKey, verseText, translation, surahName, createdAt, verseId } = bookmark;

  const { arabicFontFace = 'font-amiri', arabicFontSize = 18, tajweed = false } = settings;

  const handleCardClick = () => {
    onNavigateToVerse?.();
    onClick?.();
  };

  return (
    <BaseCard
      variant="bookmark"
      animation="bookmark"
      onClick={onNavigateToVerse ? handleCardClick : onClick}
      role="article"
      aria-label={`Bookmark for verse ${verseKey} from ${surahName}`}
      {...props}
    >
      {/* Compact header layout */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-accent font-semibold text-sm">{verseKey}</span>
          <span className="text-muted text-sm truncate">{surahName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted">{formatTimeAgo(createdAt)}</span>
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <ResponsiveVerseActions
              verseKey={verseKey!}
              isPlaying={isPlaying}
              isLoadingAudio={isLoadingAudio}
              isBookmarked={isBookmarked}
              onPlayPause={onPlayPause}
              onBookmark={onBookmark}
              onNavigateToVerse={onNavigateToVerse}
              showRemove={true}
              className="scale-90"
            />
          </div>
        </div>
      </div>

      {/* Compact verse preview */}
      <div className="space-y-2">
        {/* Arabic preview - truncated */}
        {verseText && (
          <div className="text-right">
            <p
              dir="rtl"
              className="text-foreground leading-relaxed text-lg line-clamp-2"
              style={{
                fontFamily: arabicFontFace,
                fontSize: `${Math.min(arabicFontSize, 20)}px`,
                lineHeight: 1.8,
              }}
              dangerouslySetInnerHTML={{
                __html: tajweed ? sanitizeHtml(applyTajweed(verseText)) : sanitizeHtml(verseText),
              }}
            />
          </div>
        )}

        {/* Translation preview - truncated */}
        {translation && (
          <div>
            <p
              className="text-left leading-relaxed text-muted line-clamp-2 text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(translation) }}
            />
          </div>
        )}
      </div>
    </BaseCard>
  );
});
