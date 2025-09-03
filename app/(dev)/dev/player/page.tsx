'use client';

import React, { useState } from 'react';

import QuranAudioPlayer from '@/app/shared/player/QuranAudioPlayer';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import type { Track, RepeatOptions } from '@/app/shared/player/types';
import ReciterSelector from './components/ReciterSelector';
import RepeatModeSelector from './components/RepeatModeSelector';
import DebugInfo from './components/DebugInfo';

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

/**
 * Demo page for testing the Quran Audio Player component.
 * Provides controls for reciter selection and repeat options.
 */
export default function PlayerDemoPage(): React.JSX.Element {
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
          <ReciterSelector tracks={DEMO_TRACKS} selectedTrack={track} onTrackChange={setTrack} />

          <RepeatModeSelector repeatOptions={repeat} onRepeatChange={setRepeat} />

          <DebugInfo track={track} repeatOptions={repeat} />
        </div>

        <QuranAudioPlayer track={track} />
      </div>
    </AudioProvider>
  );
}
