'use client';

import { AudioProvider } from '@/app/(features)/player/context/AudioContext';

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
