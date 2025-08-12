'use client';

import React, { useState } from 'react';
import QuranAudioPlayer from '@/app/(features)/player/QuranAudioPlayer';
import { AudioProvider } from '@/app/(features)/player/context/AudioContext';
import type { Track, RepeatOptions } from '@/app/(features)/player/types';

const DEMO_TRACKS: Track[] = [
  {
    id: 'alafasy-001',
    src: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/001.mp3',
    title: 'Al-Fātiḥah - Mishary Alafasy',
    artist: 'Mishary Alafasy',
    coverUrl: '',
    durationSec: 0,
  },
  {
    id: 'minshawi-001',
    src: 'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/mujawwad/001.mp3',
    title: 'Al-Fātiḥah - Minshawi',
    artist: 'Minshawi (Mujawwad)',
    coverUrl: '',
    durationSec: 0,
  },
];

export default function Page() {
  const [track, setTrack] = useState<Track>(DEMO_TRACKS[0]);
  const [repeat, setRepeat] = useState<RepeatOptions>({
    mode: 'off',
    start: 0,
    end: 0,
    repeatEach: 1,
    playCount: 0,
    delay: 0,
  });

  return (
    <AudioProvider>
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">Player Demo</h1>
        <div className="space-y-2 text-sm">
          <div>
            <label className="mr-2 font-medium" htmlFor="reciter">
              Reciter:
            </label>
            <select
              id="reciter"
              value={track.id}
              onChange={(e) => {
                const t = DEMO_TRACKS.find((d) => d.id === e.target.value);
                if (t) setTrack(t);
              }}
              className="border p-1 rounded"
            >
              {DEMO_TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.artist}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2 font-medium" htmlFor="repeat">
              Repeat:
            </label>
            <select
              id="repeat"
              value={repeat.mode}
              onChange={(e) =>
                setRepeat({ ...repeat, mode: e.target.value as RepeatOptions['mode'] })
              }
              className="border p-1 rounded"
            >
              <option value="off">Off</option>
              <option value="single">Single</option>
              <option value="range">Range</option>
              <option value="surah">Surah</option>
            </select>
          </div>
          {repeat.mode === 'range' && (
            <div className="space-x-2">
              <label>
                Start
                <input
                  type="number"
                  value={repeat.start}
                  onChange={(e) => setRepeat({ ...repeat, start: Number(e.target.value) })}
                  className="border ml-1 w-16 rounded p-0.5"
                />
              </label>
              <label>
                End
                <input
                  type="number"
                  value={repeat.end}
                  onChange={(e) => setRepeat({ ...repeat, end: Number(e.target.value) })}
                  className="border ml-1 w-16 rounded p-0.5"
                />
              </label>
            </div>
          )}
          <div className="space-x-2">
            <label>
              Repeat each
              <input
                type="number"
                value={repeat.repeatEach}
                onChange={(e) => setRepeat({ ...repeat, repeatEach: Number(e.target.value) })}
                className="border ml-1 w-16 rounded p-0.5"
              />
            </label>
            <label>
              Delay (s)
              <input
                type="number"
                value={repeat.delay}
                onChange={(e) => setRepeat({ ...repeat, delay: Number(e.target.value) })}
                className="border ml-1 w-20 rounded p-0.5"
              />
            </label>
          </div>
          <pre className="bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify({ track, repeat }, null, 2)}
          </pre>
        </div>
        <QuranAudioPlayer track={track} />
      </div>
    </AudioProvider>
  );
}
