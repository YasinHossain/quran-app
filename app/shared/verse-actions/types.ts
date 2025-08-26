export interface VerseActionsProps {
  verseKey: string;
  verseId?: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onNavigateToVerse?: () => void;
  showRemove?: boolean;
  className?: string;
}

export interface VerseActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  href?: string;
}
