import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import PlaybackOptionsModal from './PlaybackOptionsModal';
import SpeedControl from './SpeedControl';
import VolumeControl from './VolumeControl';
import IconBtn from './IconBtn';

export default function PlayerOptions() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <SpeedControl />
      <VolumeControl />
      <IconBtn
        className="shrink-0"
        aria-label="Options"
        onClick={() => {
          setActiveTab('reciter');
          setOpen(true);
        }}
      >
        <SlidersHorizontal />
      </IconBtn>
      <PlaybackOptionsModal
        open={open}
        onClose={() => setOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
