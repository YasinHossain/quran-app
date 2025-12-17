'use client';

import React, { memo } from 'react';

import { AlertIcon } from '@/app/shared/icons';

export const ResourcePanelLoadingSpinner = memo(function ResourcePanelLoadingSpinner(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
    </div>
  );
});

export const ResourcePanelErrorMessage = memo(function ResourcePanelErrorMessage({
  error,
}: {
  error: string;
}): React.JSX.Element {
  return (
    <div className="mx-4 mt-4 p-4 rounded-lg border bg-error/10 border-error/20 text-error">
      <div className="flex items-center space-x-2">
        <AlertIcon className="h-5 w-5 text-error" />
        <span className="text-sm">{error}</span>
      </div>
    </div>
  );
});

