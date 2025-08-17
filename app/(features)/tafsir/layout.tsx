'use client';
import './tafsir.css';
// app/(features)/tafsir/layout.tsx
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

export default function TafsirLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
