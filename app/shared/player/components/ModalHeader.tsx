import React, { memo } from 'react';

import { SlidersIcon, CloseIcon } from '@/app/shared/icons';

interface Props {
  onClose: () => void;
}

export const ModalHeader = memo(function ModalHeader({ onClose }: Props): React.JSX.Element {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-lg grid place-items-center bg-accent/10 text-accent">
        <SlidersIcon />
      </div>
      <div className="font-semibold text-foreground">Playback Options</div>
      <button
        className="p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center ml-auto"
        onClick={onClose}
        aria-label="Close options"
      >
        <CloseIcon size={18} className="text-muted hover:text-foreground" />
      </button>
    </div>
  );
});
