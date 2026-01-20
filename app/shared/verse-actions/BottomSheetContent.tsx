'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

import { BottomSheetHeader } from './BottomSheetHeader';
import { ActionList } from './components/ActionList';
import { VerseActionItem } from './types';

interface BottomSheetContentProps {
  verseKey: string;
  actions: VerseActionItem[];
  onClose: () => void;
}

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
};

// Fast, smooth easing curve - similar to iOS sheet animations
const sheetTransition = {
  type: 'tween' as const,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number], // Snappy entrance with natural deceleration
  duration: 0.18, // Faster for more responsive feel
};

export const BottomSheetContent = memo(function BottomSheetContent({
  verseKey,
  actions,
  onClose,
}: BottomSheetContentProps): React.JSX.Element {
  return (
    <motion.div
      variants={sheetVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={sheetTransition}
      style={{ willChange: 'transform' }}
      className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-modal touch-pan-y pb-safe flex flex-col max-h-[90dvh]"
    >
      <BottomSheetHeader verseKey={verseKey} onClose={onClose} />
      <ActionList actions={actions} onClose={onClose} />
    </motion.div>
  );
});
