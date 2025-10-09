'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { PinTabProps } from '@/app/shared/bookmark-modal/types';
import { PinIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

export const PinTab = memo(function PinTab({ verseId, verseKey }: PinTabProps): React.JSX.Element {
  const { isPinned, togglePinned } = useBookmarks();
  const isVersePinned = isPinned(verseId);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[200px] space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <PinIcon size={32} className={isVersePinned ? 'text-accent' : 'text-muted'} />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-foreground">
            {isVersePinned ? 'Pinned verse' : 'Pin this verse'}
          </h3>
          <p className="text-sm text-muted text-center max-w-xs">
            {isVersePinned
              ? `Verse ${verseKey || verseId} is pinned to your quick access.`
              : `Pin verse ${verseKey || verseId} for quick access from anywhere in the app.`}
          </p>
        </div>
      </div>

      <motion.button
        onClick={() => togglePinned(verseId, verseKey ? { verseKey } : undefined)}
        className={cn(
          'px-6 py-3 rounded-2xl font-medium transition-colors',
          isVersePinned
            ? 'bg-accent/10 text-accent hover:bg-accent/20'
            : 'bg-accent text-on-accent hover:bg-accent/90',
          touchClasses.target,
          touchClasses.focus
        )}
        whileTap={{ scale: 0.98 }}
      >
        {isVersePinned ? 'Unpin verse' : 'Pin verse'}
      </motion.button>
    </div>
  );
});
