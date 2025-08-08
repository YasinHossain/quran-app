'use client';
import React, { useEffect, useState } from 'react';
import { useAudio } from '@/app/context/AudioContext';
import Spinner from '@/app/components/common/Spinner';
import { FaArrowLeft, FaPlay, FaPause, FaTimes } from '@/app/components/common/SvgIcons';
import { useTranslation } from 'react-i18next';

interface AudioPlayerProps {
  onError?: (msg: string) => void;
}

export default function AudioPlayer({ onError }: AudioPlayerProps) {
  const { t } = useTranslation();
  const {
    activeVerse,
    setActiveVerse,
    audioRef,
    playingId,
    setPlayingId,
    loadingId,
    setLoadingId,
  } = useAudio();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!audioRef.current || !activeVerse?.audio?.url) return;
    audioRef.current.src = `https://verses.quran.com/${activeVerse.audio.url}`;
    setLoadingId(activeVerse.id);
    audioRef.current
      .play()
      .then(() => setPlayingId(activeVerse.id))
      .catch(() => {
        onError?.(t('could_not_play_audio'));
        setPlayingId(null);
        setLoadingId(null);
      });
  }, [activeVerse, audioRef, onError, setLoadingId, setPlayingId, t]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [activeVerse]);

  if (!activeVerse) return null;

  const isPlaying = playingId === activeVerse.id;
  const isLoading = loadingId === activeVerse.id;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.play().catch(() => {
        onError?.(t('could_not_play_audio'));
      });
      setPlayingId(activeVerse.id);
    }
  };

  const close = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(null);
    setLoadingId(null);
    setActiveVerse(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[var(--background)] border-t border-[var(--border-color)] p-4 z-50">
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={(e) => {
          const value = +e.target.value;
          if (audioRef.current) {
            audioRef.current.currentTime = value;
          }
          setCurrentTime(value);
        }}
        className="w-full mb-2"
        style={
          {
            '--value-percent': duration ? `${(currentTime / duration) * 100}%` : '0%',
          } as React.CSSProperties
        }
      />
      <div className="flex justify-between text-xs mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{activeVerse.verse_key}</span>
        <div className="flex items-center space-x-4">
          <button
            aria-label="Previous"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaArrowLeft size={20} />
          </button>
          <button
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            onClick={togglePlay}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {isLoading ? (
              <Spinner className="h-5 w-5 text-teal-600" />
            ) : isPlaying ? (
              <FaPause size={20} />
            ) : (
              <FaPlay size={20} />
            )}
          </button>
          <button
            aria-label="Next"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaArrowLeft size={20} className="rotate-180" />
          </button>
        </div>
        <button
          aria-label="Close"
          onClick={close}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <FaTimes size={20} />
        </button>
      </div>
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={close}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onLoadStart={() => setLoadingId(activeVerse.id)}
        onWaiting={() => setLoadingId(activeVerse.id)}
        onPlaying={() => {
          setPlayingId(activeVerse.id);
          setLoadingId(null);
        }}
        onCanPlay={() => setLoadingId(null)}
        onError={() => {
          onError?.(t('could_not_play_audio'));
          close();
        }}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
