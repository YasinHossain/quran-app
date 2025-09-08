'use client';

import { useTranslation } from 'react-i18next';

import { useJuzClientState } from '../hooks/useJuzClientState';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { JuzMain } from './components/JuzMain';
import { JuzSettings } from './components/JuzSettings';

export function JuzClient({ juzId }: { juzId: string }): JSX.Element {
  const { t } = useTranslation();
  const { isHidden, contentProps, settingsProps, playerBarProps } = useJuzClientState(juzId, t);

  return (
    <div className="flex flex-grow bg-surface text-foreground font-sans overflow-hidden min-h-0">
      <JuzMain isHidden={isHidden} contentProps={contentProps} />
      <JuzSettings {...settingsProps} />
      <AudioPlayerBar {...playerBarProps} />
    </div>
  );
}
