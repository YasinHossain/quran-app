export interface VerseActionsProps {
  verseKey: string;
  verseId?: string | undefined;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  // With exactOptionalPropertyTypes, explicitly allow undefined when prop is present
  onBookmark?: (() => void) | undefined;
  onShare?: (() => void) | undefined;
  onNavigateToVerse?: (() => void) | undefined;
  showRemove?: boolean | undefined;
  className?: string | undefined;
}

export interface VerseActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  href?: string;
}
