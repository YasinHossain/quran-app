'use client';

import { AlertIcon } from '@/app/shared/icons';

import { MAX_TAFSIR_SELECTIONS } from './tafsirPanel.utils';

import type { ReactElement } from 'react';

interface TafsirLimitWarningProps {
  show: boolean;
}

export const TafsirLimitWarning = ({ show }: TafsirLimitWarningProps): ReactElement | null => {
  if (!show) return null;

  return (
    <div className="absolute left-4 right-4 z-20 flex items-center space-x-2 rounded-lg border border-status-error bg-status-error/90 p-3 top-reader-header">
      <AlertIcon className="h-4 w-4 text-status-error flex-shrink-0" />
      <span className="text-sm text-on-accent">
        Maximum {MAX_TAFSIR_SELECTIONS} tafsirs can be selected
      </span>
    </div>
  );
};
