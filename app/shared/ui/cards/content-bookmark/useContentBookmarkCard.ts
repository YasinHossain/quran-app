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
}: UseContentBookmarkCardProps): ReturnType<typeof useContentBookmarkCard> {
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

function useHeaderProps(args: {
  bookmark: BookmarkData;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause?: () => void;
  onBookmark?: () => void;
  onNavigateToVerse?: () => void;
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
      verseKey: bm[0],
      surahName: bm[1],
      createdAt: bm[2],
      isPlaying,
      isLoadingAudio,
      isBookmarked,
      onPlayPause,
      onBookmark,
      onNavigateToVerse,
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
}

export type { BookmarkData };
