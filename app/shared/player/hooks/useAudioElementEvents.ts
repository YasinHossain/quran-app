import { useEffect, MutableRefObject } from 'react';

interface Options {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  src?: string;
  defaultDuration?: number;
  onTimeUpdate?: (time: number) => void;
  onLoadedMetadata?: (duration: number) => void;
}

export function useAudioElementEvents({
  audioRef,
  src,
  defaultDuration,
  onTimeUpdate,
  onLoadedMetadata,
}: Options): void {
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const handleTime = (): void => onTimeUpdate?.(a.currentTime || 0);
    const handleMeta = (): void => onLoadedMetadata?.(a.duration || defaultDuration || 0);
    a.addEventListener('timeupdate', handleTime);
    a.addEventListener('loadedmetadata', handleMeta);
    handleMeta();
    return () => {
      a.removeEventListener('timeupdate', handleTime);
      a.removeEventListener('loadedmetadata', handleMeta);
    };
  }, [audioRef, src, defaultDuration, onTimeUpdate, onLoadedMetadata]);
}
