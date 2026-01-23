'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { PinTabProps } from '@/app/shared/bookmark-modal/types';
import { PinIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { localizeDigits } from '@/lib/text/localizeNumbers';
import { cn } from '@/lib/utils/cn';

export const PinTab = memo(function PinTab({
  verseId,
  verseKey,
  onClose,
}: PinTabProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const { isPinned, togglePinned } = useBookmarks();
  // Check both verseId and verseKey to find pins regardless of storage format
  const isVersePinned = isPinned(verseId) || (verseKey ? isPinned(verseKey) : false);
  const verseRef = verseKey || verseId;
  const localizedVerseRef = localizeDigits(verseRef, i18n.language);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[200px] space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <PinIcon size={32} className={isVersePinned ? 'text-accent' : 'text-muted'} />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-foreground">
            {isVersePinned ? t('pinned_verse_title') : t('pin_this_verse_title')}
          </h3>
          <p className="text-sm text-muted text-center max-w-xs">
            {isVersePinned
              ? t('pinned_verse_description', { verseRef: localizedVerseRef })
              : t('pin_this_verse_description', { verseRef: localizedVerseRef })}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          togglePinned(verseId, verseKey ? { verseKey } : undefined);
          onClose?.();
        }}
        className={cn(
          'px-6 py-3 rounded-lg font-medium transition-colors tap-scale',
          isVersePinned
            ? 'bg-accent/10 text-accent hover:bg-accent/20'
            : 'bg-accent text-on-accent hover:bg-accent/90',
          touchClasses.target,
          touchClasses.focus
        )}
      >
        {isVersePinned ? t('unpin_verse') : t('pin_verse_action')}
      </button>
    </div>
  );
});
