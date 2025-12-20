'use client';

import dynamic from 'next/dynamic';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { Spinner } from '@/app/shared/Spinner';
import { buildAudioUrl } from '@/lib/audio/reciters';

import type { Reciter, Track } from '@/app/shared/player/types';
import type { Verse } from '@/types';

// Loading fallback extracted to keep component lean
const LoadingFallback = (): React.JSX.Element => (
  <div className="flex justify-center items-center p-4 bg-surface rounded-lg">
    <Spinner className="h-4 w-4 md:h-5 md:w-5 text-accent" />
  </div>
);

// Dynamic import for heavy QuranAudioPlayer component
const QuranAudioPlayer = dynamic(
  (): Promise<{
    default: typeof import('@/app/shared/player/QuranAudioPlayer').QuranAudioPlayer;
  }> =>
    import('@/app/shared/player/QuranAudioPlayer').then(
      (
        mod: typeof import('@/app/shared/player/QuranAudioPlayer')
      ): {
        default: typeof import('@/app/shared/player/QuranAudioPlayer').QuranAudioPlayer;
      } => ({
        default: mod.QuranAudioPlayer,
      })
    ),
  { loading: (): React.JSX.Element => <LoadingFallback />, ssr: false }
);

interface AppAudioPlayerProps {
  activeVerse: Verse | null;
  reciter: Reciter;
  isVisible: boolean;
  onNext?: () => boolean;
  onPrev?: () => boolean;
}

// Helper: build audio track object
const createTrack = (verse: Verse, reciter: Reciter): Track => ({
  id: verse.id.toString(),
  title: `Verse ${verse.verse_key}`,
  artist: reciter.name,
  durationSec: 0,
  src: buildAudioUrl(verse.verse_key, reciter.path),
});

export const AppAudioPlayer = ({
  activeVerse,
  reciter,
  isVisible,
  onNext,
  onPrev,
}: AppAudioPlayerProps): React.JSX.Element | null => {
  const { isHidden } = useHeaderVisibility();

  if (!activeVerse || !isVisible) return null;

  const track = createTrack(activeVerse, reciter);
  const handleNext = (): boolean => Boolean(onNext?.());
  const handlePrev = (): boolean => Boolean(onPrev?.());

  return (
    <div
      className={`fixed left-0 right-0 p-4 bg-background/0 z-audio-player transition-all duration-300 ease-in-out ${
        isHidden ? 'bottom-0 pb-safe' : 'bottom-0 pb-safe lg:pb-4'
      } lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-[min(90vw,60rem)]`}
      style={{
        bottom: isHidden
          ? 'env(safe-area-inset-bottom)'
          : 'calc(5rem + env(safe-area-inset-bottom))',
      }}
    >
      <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />
    </div>
  );
};
