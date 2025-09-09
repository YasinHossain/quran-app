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
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
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
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-modal touch-pan-y pb-safe flex flex-col max-h-[90dvh]"
    >
      <div className="flex justify-center pt-4 pb-2">
        <div className="w-10 h-1 bg-border rounded-full" />
      </div>
      <BottomSheetHeader verseKey={verseKey} onClose={onClose} />
      <ActionList actions={actions} onClose={onClose} />
    </motion.div>
  );
});
