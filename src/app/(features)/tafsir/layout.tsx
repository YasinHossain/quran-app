'use client';
import './tafsir.css';
// app/(features)/tafsir/layout.tsx
import { AudioProvider } from '@/presentation/shared/player/context/AudioContext';

export default function TafsirLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
