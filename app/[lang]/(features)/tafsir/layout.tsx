'use client';
import './tafsir.css';
// app/(features)/tafsir/layout.tsx
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

export default function TafsirLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <AudioProvider>{children}</AudioProvider>;
}
