'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  ShareIcon,
  BookReaderIcon,
  CloseIcon,
  EllipsisHIcon,
} from './icons';
import Spinner from './Spinner';
import { useResponsiveState, touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

interface ResponsiveVerseActionsProps {
  verseKey: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark: () => void;
  onShare?: () => void;
  className?: string;
}

const defaultShare = () => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.share) {
    navigator.share({ title: 'Quran', url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch(() => {});
  }
};

const ResponsiveVerseActions: React.FC<ResponsiveVerseActionsProps> = ({
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
  className = '',
}) => {
  const { variant } = useResponsiveState();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const handleShare = onShare || defaultShare;

  // Mobile variant - compact trigger with bottom sheet
  if (variant === 'compact') {
    return (
      <>
        <div className={cn('flex items-center justify-between', className)}>
          {/* Verse number on the left */}
          <div className="flex-shrink-0">
            <span className="font-semibold text-accent text-sm">{verseKey}</span>
          </div>

          {/* Three-dot menu on the right */}
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className={cn(
              'p-1 rounded-full hover:bg-interactive transition-colors',
              touchClasses.target,
              touchClasses.gesture,
              touchClasses.focus
            )}
            aria-label="Open verse actions menu"
          >
            <EllipsisHIcon size={18} className="text-muted" />
          </button>
        </div>

        {/* Bottom Sheet */}
        <MobileBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          verseKey={verseKey}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isBookmarked}
          onPlayPause={onPlayPause}
          onBookmark={onBookmark}
          onShare={handleShare}
        />
      </>
    );
  }

  // Desktop/Tablet variant - vertical column layout
  return (
    <div className={cn('text-center space-y-2 flex-shrink-0', className)}>
      <p className="font-semibold text-accent text-sm">{verseKey}</p>
      <div className="flex flex-col items-center space-y-1 text-muted">
        <button
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          onClick={onPlayPause}
          title="Play/Pause"
          className={cn(
            'p-1.5 rounded-full hover:bg-accent/10 transition',
            isPlaying ? 'text-accent' : 'hover:text-accent',
            touchClasses.focus
          )}
        >
          {isLoadingAudio ? (
            <Spinner className="h-4 w-4 text-accent" />
          ) : isPlaying ? (
            <PauseIcon size={18} />
          ) : (
            <PlayIcon size={18} />
          )}
        </button>

        <Link
          href={`/tafsir/${verseKey.replace(':', '/')}`}
          aria-label="View tafsir"
          title="Tafsir"
          className={cn(
            'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
            touchClasses.focus
          )}
        >
          <BookReaderIcon size={18} />
        </Link>

        <button
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          title="Bookmark"
          onClick={onBookmark}
          className={cn(
            'p-1.5 rounded-full hover:bg-accent/10 transition',
            isBookmarked ? 'text-accent' : 'hover:text-accent',
            touchClasses.focus
          )}
        >
          {isBookmarked ? <BookmarkIcon size={18} /> : <BookmarkOutlineIcon size={18} />}
        </button>

        <button
          aria-label="Share"
          title="Share"
          onClick={handleShare}
          className={cn(
            'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
            touchClasses.focus
          )}
        >
          <ShareIcon size={18} />
        </button>
      </div>
    </div>
  );
};

// Mobile bottom sheet component (extracted from original BottomSheet)
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
}

const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  verseKey,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  onBookmark,
  onShare,
}) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: '100%',
      opacity: 0,
    },
  };

  const actions = [
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
      onClick: onClose,
      href: `/tafsir/${verseKey.replace(':', '/')}`,
    },
    {
      label: isBookmarked ? 'Remove Bookmark' : 'Add Bookmark',
      icon: isBookmarked ? <BookmarkIcon size={20} /> : <BookmarkOutlineIcon size={20} />,
      onClick: () => handleAction(onBookmark),
      active: isBookmarked,
    },
    {
      label: 'Share',
      icon: <ShareIcon size={20} />,
      onClick: () => handleAction(onShare),
    },
  ];

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal touch-none"
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

            {/* Actions */}
            <div className="flex-1 overflow-y-auto p-4 pb-8">
              <div className="space-y-2">
                {actions.map((action, index) =>
                  action.href ? (
                    <Link
                      key={index}
                      href={action.href}
                      onClick={action.onClick}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-2xl hover:bg-interactive transition-all duration-200',
                        touchClasses.target,
                        touchClasses.gesture,
                        action.active ? 'text-accent' : 'text-foreground'
                      )}
                    >
                      <div className={action.active ? 'text-accent' : 'text-muted'}>
                        {action.icon}
                      </div>
                      <span className="text-base font-medium">{action.label}</span>
                    </Link>
                  ) : (
                    <motion.button
                      key={index}
                      onClick={action.onClick}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-2xl hover:bg-interactive transition-all duration-200 w-full text-left',
                        touchClasses.target,
                        touchClasses.gesture,
                        action.active ? 'text-accent' : 'text-foreground'
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={action.active ? 'text-accent' : 'text-muted'}>
                        {action.icon}
                      </div>
                      <span className="text-base font-medium">{action.label}</span>
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveVerseActions;
