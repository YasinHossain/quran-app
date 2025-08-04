'use client';
// app/features/tafsir/layout.tsx
import { AudioProvider } from '@/app/context/AudioContext';

export default function TafsirLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
