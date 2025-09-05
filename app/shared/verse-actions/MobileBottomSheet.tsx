'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
  CloseIcon,
} from '../icons';
import { Spinner } from '../Spinner';
import { VerseActionItem } from './types';

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

// Hook to generate actions configuration
function useVerseActions({
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
}: {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  showRemove: boolean;
  verseKey: string;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onNavigateToVerse?: () => void;
  handleAction: (action: () => void) => void;
}): VerseActionItem[] {
  return [
    {
      label: isPlaying ? 'Pause Audio' : 'Play Audio',
      icon: isLoadingAudio ? (
        <Spinner className="h-5 w-5 text-accent" />
      ) : isPlaying ? (
        <PauseIcon size={20} />
      ) : (
        <PlayIcon size={20} />
      ),
      onClick: () => handleAction(onPlayPause),
      active: isPlaying,
    },
    {
      label: 'View Tafsir',
      icon: <BookReaderIcon size={20} />,
      onClick: () => {},
      href: `/tafsir/${verseKey.replace(':', '/')}`,
    },
    ...(onNavigateToVerse
      ? [
          {
            label: 'Go to Verse',
            icon: <BookReaderIcon size={20} />,
            onClick: () => handleAction(onNavigateToVerse),
          },
        ]
      : []),
    {
      label: showRemove ? 'Remove Bookmark' : isBookmarked ? 'Remove Bookmark' : 'Add Bookmark',
      icon:
        isBookmarked || showRemove ? <BookmarkIcon size={20} /> : <BookmarkOutlineIcon size={20} />,
      onClick: () => handleAction(onBookmark),
      active: isBookmarked || showRemove,
    },
    {
      label: 'Share',
      icon: <ShareIcon size={20} />,
      onClick: () => handleAction(onShare),
    },
  ];
}

interface ActionListProps {
  actions: VerseActionItem[];
  onClose: () => void;
}

const ActionList = ({ actions, onClose }: ActionListProps): React.JSX.Element => (
  <div className="flex-1 overflow-y-auto p-4 pb-8">
    <div className="space-y-2">
      {actions.map((action, index) =>
        action.href ? (
          <Link
            key={index}
            href={action.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-4 p-4 rounded-2xl transition-all duration-200',
              'hover:bg-interactive active:bg-interactive',
              touchClasses.target,
              touchClasses.gesture,
              touchClasses.focus,
              touchClasses.active,
              action.active && 'bg-accent/10 text-accent'
            )}
          >
            <div className="flex-shrink-0">{action.icon}</div>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ) : (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              'flex w-full items-center gap-4 p-4 rounded-2xl transition-all duration-200',
              'hover:bg-interactive active:bg-interactive',
              touchClasses.target,
              touchClasses.gesture,
              touchClasses.focus,
              touchClasses.active,
              action.active && 'bg-accent/10 text-accent'
            )}
          >
            <div className="flex-shrink-0">{action.icon}</div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        )
      )}
    </div>
  </div>
);

export const MobileBottomSheet = ({
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
}: MobileBottomSheetProps): React.JSX.Element => {
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal touch-none"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
            }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-modal touch-pan-y pb-safe flex flex-col max-h-[90dvh]"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
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
};
