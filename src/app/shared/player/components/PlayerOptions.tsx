import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import PlaybackOptionsModal from './PlaybackOptionsModal';
import SpeedControl from './SpeedControl';
import VolumeControl from './VolumeControl';
import { Button } from '@/presentation/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

export default function PlayerOptions() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <SpeedControl />
      <div className="hidden sm:block">
        <VolumeControl />
      </div>
      <Button
        variant="icon-round"
        size="icon-round"
        className="shrink-0"
        aria-label="Options"
        onClick={() => {
          setActiveTab('reciter');
          setOpen(true);
        }}
      >
        <SlidersHorizontal className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
      <PlaybackOptionsModal
        open={open}
        onClose={() => setOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
