'use client';

import { useEffect, useState } from 'react';
import { QuranAudioPlayer } from '@/app/shared/player';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { getSurahCoverUrl } from '@/lib/api';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import type { Verse } from '@/types';
import type { Reciter } from '@/app/shared/player/types';

interface SurahAudioPlayerProps {
  activeVerse: Verse | null;
  reciter: Reciter;
  isVisible: boolean;
  onNext: () => boolean;
  onPrev: () => boolean;
}

export const SurahAudioPlayer = ({
  activeVerse,
  reciter,
  isVisible,
  onNext,
  onPrev,
}: SurahAudioPlayerProps) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { isHidden } = useHeaderVisibility();

  useEffect(() => {
    if (activeVerse) {
      const surahNumber = parseInt(activeVerse.verse_key.split(':')[0], 10);
      getSurahCoverUrl(surahNumber).then(setCoverUrl);
    }
  }, [activeVerse]);

  if (!activeVerse || !isVisible) return null;

  const track = {
    id: activeVerse.id.toString(),
    title: `Verse ${activeVerse.verse_key}`,
    artist: reciter.name,
    coverUrl: coverUrl || '',
    durationSec: 0,
    src: buildAudioUrl(activeVerse.verse_key, reciter.path),
  };

  return (
    <div
      className={`fixed left-0 right-0 p-4 bg-transparent z-audio-player transition-all duration-300 ease-in-out ${
        isHidden ? 'bottom-0 pb-safe' : 'bottom-0 pb-safe lg:pb-4'
      }`}
      style={{
        bottom: isHidden
          ? 'env(safe-area-inset-bottom)'
          : 'calc(5rem + env(safe-area-inset-bottom))',
      }}
    >
      <QuranAudioPlayer track={track} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default SurahAudioPlayer;
