'use client';

import { memo } from 'react';

import { BottomSheetHeader } from './BottomSheetHeader';
import { ActionList } from './components/ActionList';
import { VerseActionItem } from './types';

interface BottomSheetContentProps {
  verseKey: string;
  actions: VerseActionItem[];
  onClose: () => void;
  isExiting?: boolean;
}

export const BottomSheetContent = memo(function BottomSheetContent({
  verseKey,
  actions,
  onClose,
  isExiting = false,
}: BottomSheetContentProps): React.JSX.Element {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-modal touch-pan-y pb-safe flex flex-col max-h-[90dvh] transform-gpu ${isExiting ? 'animate-sheet-out' : 'animate-sheet-in'}`}
      style={{ willChange: 'transform' }}
    >
      <BottomSheetHeader verseKey={verseKey} onClose={onClose} />
      <ActionList actions={actions} onClose={onClose} />
    </div>
  );
});
