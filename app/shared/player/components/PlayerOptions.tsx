import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import PlaybackOptionsModal from './PlaybackOptionsModal';
import SpeedControl from './SpeedControl';
import VolumeControl from './VolumeControl';
import IconBtn from './IconBtn';

interface Props {
  theme: 'light' | 'dark';
}

export default function PlayerOptions({ theme }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');
  return (
    <>
      <SpeedControl theme={theme} />
      <VolumeControl theme={theme} />
      <IconBtn
        aria-label="Options"
        onClick={() => {
          setActiveTab('reciter');
          setOpen(true);
        }}
        theme={theme}
      >
        <SlidersHorizontal />
      </IconBtn>
      <PlaybackOptionsModal
        open={open}
        onClose={() => setOpen(false)}
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}
