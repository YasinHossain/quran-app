import React, { useState } from 'react';

import { SlidersIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

import { PlaybackOptionsModal } from './PlaybackOptionsModal';
import { SpeedControl } from './SpeedControl';
import { VolumeControl } from './VolumeControl';

export function PlayerOptions(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <SpeedControl />
      <div className="hidden sm:block">
        <VolumeControl />
      </div>
      <button
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0"
        aria-label="Options"
        onClick={() => {
          setActiveTab('reciter');
          setOpen(true);
        }}
      >
        <SlidersIcon size={18} />
      </button>
      <PlaybackOptionsModal
        open={open}
        onClose={() => setOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
