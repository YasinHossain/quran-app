'use client';

import { memo } from 'react';

interface BottomSheetBackdropProps {
  onClick: () => void;
  isExiting?: boolean;
}

export const BottomSheetBackdrop = memo(function BottomSheetBackdrop({
  onClick,
  isExiting = false,
}: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Close"
      className={`fixed inset-0 bg-surface-overlay/60 z-modal touch-none ${isExiting ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
      onClick={onClick}
    />
  );
});
