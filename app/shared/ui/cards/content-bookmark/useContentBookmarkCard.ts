import { useCallback, useMemo } from 'react';

import type React from 'react';

interface BookmarkData {
  verseKey?: string;
  verseText?: string;
  translation?: string;
  surahName?: string;
  createdAt: number;
  verseId: string | number;
  verseApiId?: number;
}

interface Settings {
  arabicFontFace?: string;
  arabicFontSize?: number;
  tajweed?: boolean;
}

interface UseContentBookmarkCardProps {
  bookmark: BookmarkData;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onPlayPause?: () => void;
  isBookmarked: boolean;
  onBookmark?: () => void;
  onNavigateToVerse?: () => void;
  settings: Settings;
  onClick?: (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => void;
}

export function useContentBookmarkCard({
  bookmark,
  isPlaying,
  isLoadingAudio,
  onPlayPause,
  isBookmarked,
  onBookmark,
  onNavigateToVerse,
  settings,
  onClick,
}: UseContentBookmarkCardProps): UseContentBookmarkCardReturn {
  const handleCardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      onNavigateToVerse?.();
      onClick?.(e);
    },
    [onNavigateToVerse, onClick]
  );

  const headerProps = useHeaderProps({
    bookmark,
    isPlaying,
    isLoadingAudio,
    isBookmarked,
    onPlayPause,
    onBookmark,
    onNavigateToVerse,
  });

  const previewProps = usePreviewProps({ bookmark, settings });

  return { handleCardClick, headerProps, previewProps } as const;
}

interface UseContentBookmarkCardReturn {
  handleCardClick: (event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => void;
  headerProps: ReturnType<typeof useHeaderProps>;
  previewProps: ReturnType<typeof usePreviewProps>;
}

function useHeaderProps(args: {
  bookmark: BookmarkData;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause?: (() => void) | undefined;
  onBookmark?: (() => void) | undefined;
  onNavigateToVerse?: (() => void) | undefined;
}): {
  verseKey?: string;
  surahName?: string;
  createdAt: number;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause?: () => void;
  onBookmark?: () => void;
  onNavigateToVerse?: () => void;
} {
  const {
    bookmark,
    isPlaying,
    isLoadingAudio,
    isBookmarked,
    onPlayPause,
    onBookmark,
    onNavigateToVerse,
  } = args;
  const bm = useMemo(
    () => [bookmark.verseKey, bookmark.surahName, bookmark.createdAt] as const,
    [bookmark.verseKey, bookmark.surahName, bookmark.createdAt]
  );
  return useMemo(
    () => ({
      ...(bm[0] !== undefined ? { verseKey: bm[0] } : {}),
      ...(bm[1] !== undefined ? { surahName: bm[1] } : {}),
      createdAt: bm[2],
      isPlaying,
      isLoadingAudio,
      isBookmarked,
      ...(onPlayPause ? { onPlayPause } : {}),
      ...(onBookmark ? { onBookmark } : {}),
      ...(onNavigateToVerse ? { onNavigateToVerse } : {}),
    }),
    [bm, isPlaying, isLoadingAudio, isBookmarked, onPlayPause, onBookmark, onNavigateToVerse]
  );
}

function usePreviewProps({ bookmark, settings }: { bookmark: BookmarkData; settings: Settings }): {
  verseText?: string;
  translation?: string;
  arabicFontFace: string;
  arabicFontSize: number;
  tajweed: boolean;
} {
  return useMemo(
    () => ({
      ...(bookmark.verseText !== undefined ? { verseText: bookmark.verseText } : {}),
      ...(bookmark.translation !== undefined ? { translation: bookmark.translation } : {}),
      arabicFontFace: settings.arabicFontFace ?? 'font-amiri',
      arabicFontSize: settings.arabicFontSize ?? 18,
      tajweed: settings.tajweed ?? false,
    }),
    [
      bookmark.verseText,
      bookmark.translation,
      settings.arabicFontFace,
      settings.arabicFontSize,
      settings.tajweed,
    ]
  );
}

export type { BookmarkData };
