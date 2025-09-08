'use client';

import React from 'react';

import { SurahAudioPlayer } from '@/app/(features)/surah/components/SurahAudioPlayer';

import type { Verse, Reciter } from '@/types';

interface SurahAudioProps {
  activeVerse: Verse | null;
  reciter: Reciter | null;
  isVisible: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function SurahAudio({
  activeVerse,
  reciter,
  isVisible,
  onNext,
  onPrev,
}: SurahAudioProps): React.JSX.Element {
  return (
    <SurahAudioPlayer
      activeVerse={activeVerse}
      reciter={reciter}
      isVisible={isVisible}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
}
