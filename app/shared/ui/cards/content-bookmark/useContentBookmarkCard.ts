import { useCallback, useMemo } from 'react';

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
}: UseContentBookmarkCardProps) {
  const handleCardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      onNavigateToVerse?.();
      onClick?.(e);
    },
    [onNavigateToVerse, onClick]
  );

  const headerProps = useMemo(
    () => ({
      verseKey: bookmark.verseKey,
      surahName: bookmark.surahName,
      createdAt: bookmark.createdAt,
      isPlaying,
      isLoadingAudio,
      isBookmarked,
      onPlayPause,
      onBookmark,
      onNavigateToVerse,
    }),
    [
      bookmark.verseKey,
      bookmark.surahName,
      bookmark.createdAt,
      isPlaying,
      isLoadingAudio,
      isBookmarked,
      onPlayPause,
      onBookmark,
      onNavigateToVerse,
    ]
  );

  const previewProps = useMemo(
    () => ({
      verseText: bookmark.verseText,
      translation: bookmark.translation,
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

  return { handleCardClick, headerProps, previewProps } as const;
}

export type { BookmarkData };
