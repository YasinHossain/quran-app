import { useEffect, useMemo, useState } from 'react';

import { getSurahCoverUrl } from '@/lib/api';
import { buildAudioUrl } from '@/lib/audio/reciters';

import type { Track, Reciter } from '@/app/shared/player/types';
import type { Verse } from '@/types/verse';

export function useCoverAndTrack(
  activeVerse: Verse | null,
  reciter: Reciter
): { coverUrl: string | null; track: Track | null } {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVerse) return;
    const [surahStr] = activeVerse.verse_key.split(':');
    const surahNumber = Number.parseInt(surahStr ?? '0', 10);
    getSurahCoverUrl(surahNumber).then(setCoverUrl);
  }, [activeVerse]);

  const track: Track | null = useMemo(() => {
    if (!activeVerse) return null;
    return {
      id: activeVerse.id.toString(),
      title: `Verse ${activeVerse.verse_key}`,
      artist: reciter.name,
      coverUrl: coverUrl || '',
      durationSec: 0,
      src: buildAudioUrl(activeVerse.verse_key, reciter.path),
    };
  }, [activeVerse, reciter, coverUrl]);

  return { coverUrl, track } as const;
}
