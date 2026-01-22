import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  artist: string;
}

export function TrackInfo({ title, artist }: Props): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 min-w-0 pl-1">
      <div className="min-w-0 flex-1 sm:flex-initial">
        <div
          className="text-sm font-semibold tracking-[-0.01em] truncate text-foreground"
          aria-label={t('current_track_title')}
        >
          {title}
        </div>
        <div className="text-xs -mt-0.5 truncate text-muted sm:block">{artist}</div>
      </div>
    </div>
  );
}
