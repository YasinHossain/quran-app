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
    <>
      <SpeedControl />
      <VolumeControl />
      <IconBtn
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
    </>
  );
}
