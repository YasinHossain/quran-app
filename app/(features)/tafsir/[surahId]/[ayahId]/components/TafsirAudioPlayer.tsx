'use client';

import { AppAudioPlayer } from '@/app/shared/player/AppAudioPlayer';

import type { Reciter } from '@/app/shared/player/types';
import type { Verse } from '@/types';

interface TafsirAudioPlayerProps {
  activeVerse: Verse | null;
  reciter: Reciter;
  isVisible: boolean;
  onNext?: () => boolean;
  onPrev?: () => boolean;
}

export const TafsirAudioPlayer = (props: TafsirAudioPlayerProps): React.JSX.Element | null => {
  return <AppAudioPlayer {...props} />;
};
