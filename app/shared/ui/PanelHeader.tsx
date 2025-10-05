'use client';
import React, { memo } from 'react';

import { CloseIcon } from '@/app/shared/icons';

import { Button } from './Button';

interface PanelHeaderProps {
  title?: string;
  showCloseButton: boolean;
  onClose: () => void;
}

export const PanelHeader = memo(function PanelHeader({
  title,
  showCloseButton,
  onClose,
}: PanelHeaderProps): React.JSX.Element | null {
  if (!title && !showCloseButton) return null;
  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {showCloseButton && (
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
          <CloseIcon size={18} />
        </Button>
      )}
    </header>
  );
});
