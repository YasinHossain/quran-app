import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  src?: string;
  defaultDuration?: number;
  onTimeUpdate?: (time: number) => void;
  onLoadedMetadata?: (duration: number) => void;
};

export default function useAudioPlayer(options: Options = {}) {
  const { src, defaultDuration, onTimeUpdate, onLoadedMetadata } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback(
    (sec: number) => {
      const a = audioRef.current;
      if (!a) return 0;
      const max = a.duration || defaultDuration || 0;
      a.currentTime = Math.max(0, Math.min(max, sec));
      const t = a.currentTime || 0;
      onTimeUpdate?.(t);
      return t;
    },
    [defaultDuration, onTimeUpdate]
  );

  const setVolume = useCallback((vol: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = vol;
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = rate;
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [isPlaying, src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => onTimeUpdate?.(a.currentTime || 0);
    const onMeta = () => onLoadedMetadata?.(a.duration || defaultDuration || 0);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    onMeta();
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
    };
  }, [src, defaultDuration, onTimeUpdate, onLoadedMetadata]);

  return { audioRef, isPlaying, play, pause, seek, setVolume, setPlaybackRate };
}
