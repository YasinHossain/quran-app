'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookmarkModal } from '@/app/shared/components/BookmarkModal';
import { VerseActionsProps } from '@/app/shared/verse-actions/types';
import { defaultShare } from '@/app/shared/verse-actions/utils';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

import { BookmarkButton } from './components/BookmarkButton';
import { NavigateToVerseLink } from './components/NavigateToVerseLink';
import { PlayPauseButton } from './components/PlayPauseButton';
import { TafsirLink } from './components/TafsirLink';
import { VerseOptionsMenu } from './components/VerseOptionsMenu';

export const DesktopVerseActions = ({
  verseKey,
  verseId,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  onAddToPlan,
  onNavigateToVerse,
  navigateHref,
  showRemove = false,
  className = '',
}: VerseActionsProps): React.JSX.Element => {
  const { i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const handleShare = onShare || defaultShare;
  const handleAddToPlan = useCallback(() => {
    if (onAddToPlan) onAddToPlan();
  }, [onAddToPlan]);

  const handleBookmarkClick = (): void => {
    if (showRemove && onBookmark) {
      onBookmark();
    } else {
      setIsBookmarkModalOpen(true);
    }
  };

  return (
    <div className={cn('text-center space-y-2 flex-shrink-0', className)}>
      <p className="font-semibold text-accent text-sm">{localizeDigits(verseKey, language)}</p>
      <div className="flex flex-col items-center space-y-1 text-muted">
        <PlayPauseButton
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          onPlayPause={onPlayPause}
        />
        <TafsirLink verseKey={verseKey} />
        <NavigateToVerseLink
          {...(onNavigateToVerse ? { onNavigateToVerse } : {})}
          {...(navigateHref ? { href: navigateHref } : {})}
        />
        <BookmarkButton
          isBookmarked={Boolean(isBookmarked)}
          showRemove={showRemove}
          onClick={handleBookmarkClick}
        />
        <VerseOptionsMenu onShare={handleShare} onAddToPlan={handleAddToPlan} />
      </div>

      {isBookmarkModalOpen ? (
        <BookmarkModal
          isOpen
          onClose={() => setIsBookmarkModalOpen(false)}
          verseId={verseId || verseKey}
          verseKey={verseKey}
        />
      ) : null}
    </div>
  );
};
