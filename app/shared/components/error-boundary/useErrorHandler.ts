'use client';

import React from 'react';

import { ErrorHandler } from '@/src/infrastructure/errors';

export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    ErrorHandler.handle(error);

    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  }, []);
}
