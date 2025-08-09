'use client';

import React, { useEffect, useState } from 'react';
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Mic2,
} from 'lucide-react';
import useAudioPlayer from './useAudioPlayer';
import type { Track } from './types';

interface CleanPlayerProps {
  src?: string;
  title?: string;
  onError?: (msg: string) => void;
}

export default function CleanPlayer({ src, title, onError }: CleanPlayerProps) {
  const { audioRef, isPlaying, progress, duration, toggle, seek, setTrack } = useAudioPlayer();
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (src) {
      const t: Track = { id: src, url: src, title };
      setTrack(t);
    }
  }, [src, title, setTrack]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    seek(t);
  };

  const skipForward = () => seek(Math.min(duration, progress + 10));
  const skipBack = () => seek(Math.max(0, progress - 10));

  const toggleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
    setIsRepeat((r) => !r);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted((m) => !m);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-[var(--background)] p-4">
      <audio ref={audioRef} onError={() => onError?.('could_not_play_audio')}>
        <track kind="captions" />
      </audio>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          aria-label="skip_back"
          onClick={skipBack}
          className="p-2 border rounded-full"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label={isPlaying ? 'pause_audio' : 'play_audio'}
          onClick={toggle}
          className="p-2 border rounded-full"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button
          type="button"
          aria-label="skip_forward"
          onClick={skipForward}
          className="p-2 border rounded-full"
        >
          <SkipForward className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="toggle_repeat"
          onClick={toggleRepeat}
          className="p-2 border rounded-full"
        >
          <Repeat className={`h-5 w-5 ${isRepeat ? '' : 'text-gray-500'}`} />
        </button>
        <button
          type="button"
          aria-label="toggle_mute"
          onClick={toggleMute}
          className="p-2 border rounded-full"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <button
          type="button"
          aria-label="audio_settings"
          onClick={() => {}}
          className="p-2 border rounded-full"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="microphone"
          onClick={() => {}}
          className="p-2 border rounded-full"
        >
          <Mic2 className="h-5 w-5" />
        </button>
        <div className="flex-1">
          {title && <div className="text-sm mb-1">{title}</div>}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={handleChange}
            className="w-full"
          />
          <div className="text-xs flex justify-between">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
