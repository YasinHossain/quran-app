'use client';

import { AudioProvider } from '@/presentation/shared/player/context/AudioContext';

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
