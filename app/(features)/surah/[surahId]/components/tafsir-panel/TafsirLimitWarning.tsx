'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MAX_SELECTIONS } from './tafsirPanel.utils';

interface TafsirLimitWarningProps {
  show: boolean;
}

export const TafsirLimitWarning: React.FC<TafsirLimitWarningProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute top-16 left-4 right-4 p-3 rounded-lg z-20 flex items-center space-x-2 bg-red-900/90 border-red-700 border">
      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
      <span className="text-sm text-red-200">Maximum {MAX_SELECTIONS} tafsirs can be selected</span>
    </div>
  );
};
