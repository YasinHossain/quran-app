'use client';

import React from 'react';

import { SurahAudioPlayer } from '@/app/(features)/surah/components/SurahAudioPlayer';

import type { Reciter } from '@/app/shared/player/types';
import type { Verse } from '@/types';
import type { ReactElement } from 'react';

interface SurahAudioProps {
  activeVerse: Verse | null;
  reciter: Reciter | null;
  isVisible: boolean;
  onNext: () => boolean;
  onPrev: () => boolean;
}

export function SurahAudio({
  activeVerse,
  reciter,
  isVisible,
  onNext,
  onPrev,
}: SurahAudioProps): ReactElement | null {
  if (!reciter) {
    return null;
  }

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
