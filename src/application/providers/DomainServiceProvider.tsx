'use client';

import { createContext, useContext, ReactNode } from 'react';
import { BookmarkService } from '@/src/domain/services/BookmarkService';
import { SearchService } from '@/src/domain/services/SearchService';
import { ReadingProgressService } from '@/src/domain/services/ReadingProgressService';

export interface DomainServices {
  bookmarkService: BookmarkService;
  searchService: SearchService;
  readingProgressService: ReadingProgressService;
}

const DomainServiceContext = createContext<DomainServices | null>(null);

interface DomainServiceProviderProps {
  services: DomainServices;
  children: ReactNode;
}

export const DomainServiceProvider = ({ services, children }: DomainServiceProviderProps) => {
  return <DomainServiceContext.Provider value={services}>{children}</DomainServiceContext.Provider>;
};

export const useDomainServices = (): DomainServices => {
  const context = useContext(DomainServiceContext);
  if (!context) {
    throw new Error('useDomainServices must be used within a DomainServiceProvider');
  }
  return context;
};
