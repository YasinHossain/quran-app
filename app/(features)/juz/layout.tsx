// app/(features)/juz/layout.tsx
'use client';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

export default function JuzLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <AudioProvider>{children}</AudioProvider>;
}
