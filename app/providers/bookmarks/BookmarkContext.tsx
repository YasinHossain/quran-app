'use client';

import { createContext, useContext } from 'react';

import { BookmarkContextType } from './types';

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
