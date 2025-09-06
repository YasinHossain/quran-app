'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';

import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import { CloseIcon } from '../icons';
import { ActionList } from './components/ActionList';
import { useVerseActions } from './hooks/useVerseActions';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onNavigateToVerse?: () => void;
  showRemove?: boolean;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
};

export const MobileBottomSheet = memo(function MobileBottomSheet({
  isOpen,
  onClose,
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  onNavigateToVerse,
  showRemove = false,
}: MobileBottomSheetProps): React.JSX.Element {
  const handleAction = (action: () => void): void => {
    action();
    onClose();
  };

  const actions = useVerseActions({
    isPlaying,
    isLoadingAudio,
    isBookmarked,
    showRemove,
    verseKey,
    onPlayPause,
    onBookmark,
    onShare,
    onNavigateToVerse,
    handleAction,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal touch-none"
            onClick={onClose}
          />
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-modal touch-pan-y pb-safe flex flex-col max-h-[90dvh]"
          >
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Verse {verseKey}</h2>
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-full hover:bg-interactive transition-colors',
                  touchClasses.target,
                  touchClasses.gesture,
                  touchClasses.focus
                )}
                aria-label="Close"
              >
                <CloseIcon size={20} className="text-muted" />
              </button>
            </div>
            <ActionList actions={actions} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
