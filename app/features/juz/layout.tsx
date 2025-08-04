// app/features/juz/layout.tsx
'use client';
import { AudioProvider } from '@/app/context/AudioContext';

export default function JuzLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
