'use client';

import { AudioProvider } from '@/presentation/shared/player/context/AudioContext';

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
