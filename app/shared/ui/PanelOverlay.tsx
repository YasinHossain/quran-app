'use client';
import React, { memo } from 'react';

interface PanelOverlayProps {
  onClose: () => void;
  closeOnOverlayClick: boolean;
}

export const PanelOverlay = memo(function PanelOverlay({
  onClose,
  closeOnOverlayClick,
}: PanelOverlayProps): React.JSX.Element {
  const handleOverlayInteraction = closeOnOverlayClick ? onClose : undefined;
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (!closeOnOverlayClick) return;
    if (e.key === 'Escape' || e.key === 'Enter') onClose();
  };
  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
      onClick={handleOverlayInteraction}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={closeOnOverlayClick ? 0 : -1}
      aria-label="Close panel"
    />
  );
});
