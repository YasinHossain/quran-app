'use client';

import { useEffect, useState } from 'react';
import { QuranAudioPlayer } from '@/app/shared/player';
import { buildAudioUrl } from '@/lib/audio/reciters';
import { getSurahCoverUrl } from '@/lib/api';
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
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-transparent z-50">
      <QuranAudioPlayer track={track} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default SurahAudioPlayer;
