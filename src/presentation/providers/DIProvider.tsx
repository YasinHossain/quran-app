'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Container } from 'inversify';
import { container } from '../../shared/config/container';

const DIContext = createContext<Container | null>(null);

interface DIProviderProps {
  children: ReactNode;
}

export const DIProvider: React.FC<DIProviderProps> = ({ children }) => {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
};

export const useContainer = (): Container => {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useContainer must be used within DIProvider');
  }
  return context;
};

// Helper hook to get services
export const useService = <T,>(serviceIdentifier: symbol): T => {
  const container = useContainer();
  return container.get<T>(serviceIdentifier);
};
