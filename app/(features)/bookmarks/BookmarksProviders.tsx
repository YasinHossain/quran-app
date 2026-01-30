'use client';

import { AudioProvider } from '@/app/shared/player/context/AudioContext';

export function BookmarksProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <AudioProvider>{children}</AudioProvider>;
}
