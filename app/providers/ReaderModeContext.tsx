'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ReaderMode = 'verse' | 'mushaf';

interface ReaderModeContextValue {
  mode: ReaderMode;
  setMode: (mode: ReaderMode) => void;
  isReaderModeAvailable: boolean;
  enableReaderMode: (initialMode?: ReaderMode) => void;
  disableReaderMode: () => void;
}

const ReaderModeContext = createContext<ReaderModeContextValue | undefined>(undefined);

export const ReaderModeProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [mode, setMode] = useState<ReaderMode>('verse');
  const [isReaderModeAvailable, setReaderModeAvailable] = useState(false);

  const enableReaderMode = useCallback((initialMode: ReaderMode = 'verse') => {
    setReaderModeAvailable(true);
    setMode(initialMode);
  }, []);

  const disableReaderMode = useCallback(() => {
    setReaderModeAvailable(false);
    setMode('verse');
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isReaderModeAvailable,
      enableReaderMode,
      disableReaderMode,
    }),
    [mode, isReaderModeAvailable, enableReaderMode, disableReaderMode]
  );

  return <ReaderModeContext.Provider value={value}>{children}</ReaderModeContext.Provider>;
};

export const useReaderMode = (): ReaderModeContextValue => {
  const context = useContext(ReaderModeContext);
  if (!context) {
    throw new Error('useReaderMode must be used within ReaderModeProvider');
  }
  return context;
};

