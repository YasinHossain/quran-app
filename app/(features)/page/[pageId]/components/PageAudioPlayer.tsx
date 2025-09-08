import dynamic from 'next/dynamic';

import { Spinner } from '@/app/shared/Spinner';

import type { Track } from '@/app/shared/player/types';

// Dynamic import for heavy QuranAudioPlayer component
const QuranAudioPlayer = dynamic(
  () =>
    import('@/app/shared/player/QuranAudioPlayer').then((mod) => ({
      default: mod.QuranAudioPlayer,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center p-4 bg-surface rounded-lg">
        <Spinner className="h-4 w-4 md:h-5 md:w-5 text-accent" />
      </div>
    ),
    ssr: false,
  }
);

interface PageAudioPlayerProps {
  track: Track | null;
  isVisible: boolean;
  isHidden: boolean;
  onNext: () => boolean;
  onPrev: () => boolean;
}

/**
 * Renders the floating audio player for page verses
 */
export function PageAudioPlayer({
  track,
  isVisible,
  isHidden,
  onNext,
  onPrev,
}: PageAudioPlayerProps): JSX.Element | null {
  if (!track || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed left-0 right-0 p-4 bg-transparent z-audio-player transition-all duration-300 ease-in-out ${
        isHidden ? 'bottom-0 pb-safe' : 'bottom-0 pb-safe lg:pb-4'
      } lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-[min(90vw,60rem)]`}
      style={{
        bottom: isHidden
          ? 'env(safe-area-inset-bottom)'
          : 'calc(5rem + env(safe-area-inset-bottom))',
      }}
    >
      <QuranAudioPlayer track={track} onNext={onNext} onPrev={onPrev} />
    </div>
  );
}
