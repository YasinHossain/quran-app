'use client';
import React, { useEffect, useState } from 'react';
import { useAudio } from '@/app/context/AudioContext';
import { API_BASE_URL } from '@/lib/api';
import type { Verse } from '@/types';
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
    repeatSettings,
  } = useAudio();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [currentPlay, setCurrentPlay] = useState(1);

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
    setCurrentRepeat(1);
    setCurrentPlay(1);
  }, [activeVerse]);

  useEffect(() => {
    const savedRate = localStorage.getItem('audioPlaybackRate');
    if (savedRate) {
      const rate = parseFloat(savedRate);
      if (!Number.isNaN(rate)) {
        setPlaybackRate(rate);
        if (audioRef.current) audioRef.current.playbackRate = rate;
      }
    }
  }, [audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
    localStorage.setItem('audioPlaybackRate', playbackRate.toString());
  }, [playbackRate, audioRef]);

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
    setCurrentRepeat(1);
    setCurrentPlay(1);
  };

  const fetchVerse = async (key: string): Promise<Verse | null> => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/verses/by_key/${encodeURIComponent(key)}?fields=text_uthmani,audio`
      );
      const data = await res.json();
      return data.verse as Verse;
    } catch {
      return null;
    }
  };

  const handleEnded = async () => {
    const { mode, start, end, playCount, repeatEach, delay } = repeatSettings;
    const [surah, ayah] = activeVerse.verse_key.split(':').map(Number);

    if (mode === 'single') {
      if (currentRepeat < repeatEach) {
        setCurrentRepeat(currentRepeat + 1);
        setTimeout(() => audioRef.current?.play(), delay * 1000);
        return;
      }
      if (currentPlay < playCount) {
        setCurrentRepeat(1);
        setCurrentPlay(currentPlay + 1);
        setTimeout(() => audioRef.current?.play(), delay * 1000);
        return;
      }
      close();
      return;
    }

    const nextVerseNumber = ayah;

    if (mode === 'range') {
      if (currentRepeat < repeatEach) {
        setCurrentRepeat(currentRepeat + 1);
        setTimeout(() => audioRef.current?.play(), delay * 1000);
        return;
      }
      if (nextVerseNumber < end) {
        const next = await fetchVerse(`${surah}:${nextVerseNumber + 1}`);
        if (next) {
          setCurrentRepeat(1);
          setActiveVerse(next);
        } else {
          close();
        }
        return;
      }
      if (currentPlay < playCount) {
        const first = await fetchVerse(`${surah}:${start}`);
        if (first) {
          setCurrentRepeat(1);
          setCurrentPlay(currentPlay + 1);
          setActiveVerse(first);
        } else {
          close();
        }
        return;
      }
      close();
      return;
    }

    if (mode === 'surah') {
      const next = await fetchVerse(`${surah}:${nextVerseNumber + 1}`);
      if (next) {
        setActiveVerse(next);
      } else {
        close();
      }
    }
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
          <select
            aria-label="Playback speed"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded text-sm p-1"
          >
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <option key={rate} value={rate}>
                {rate}×
              </option>
            ))}
          </select>
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
        onEnded={handleEnded}
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
