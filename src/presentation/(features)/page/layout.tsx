// app/(features)/page/layout.tsx
'use client';
import { AudioProvider } from '@/presentation/shared/player/context/AudioContext';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
