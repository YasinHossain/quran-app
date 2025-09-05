'use client';

import { AlertIcon } from '@/app/shared/icons';

import { MAX_TAFSIR_SELECTIONS } from './tafsirPanel.utils';

interface TafsirLimitWarningProps {
  show: boolean;
}

export const TafsirLimitWarning = ({ show }: TafsirLimitWarningProps): JSX.Element => {
  if (!show) return null;

  return (
    <div className="absolute top-16 left-4 right-4 p-3 rounded-lg z-20 flex items-center space-x-2 bg-status-error/90 border-status-error border">
      <AlertIcon className="h-4 w-4 text-status-error flex-shrink-0" />
      <span className="text-sm text-on-accent">
        Maximum {MAX_TAFSIR_SELECTIONS} tafsirs can be selected
      </span>
    </div>
  );
};
