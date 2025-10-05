import React, { memo } from 'react';

import { SlidersIcon } from '@/app/shared/icons';

interface Props {
  onClose: () => void;
}

export const ModalHeader = memo(function ModalHeader({ onClose }: Props): React.JSX.Element {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-xl grid place-items-center bg-accent/10 text-accent">
        <SlidersIcon />
      </div>
      <div className="font-semibold text-foreground">Playback Options</div>
      <button className="ml-auto text-muted hover:text-foreground" onClick={onClose}>
        ✕
      </button>
    </div>
  );
});
