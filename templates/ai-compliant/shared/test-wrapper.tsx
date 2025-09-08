'use client';

import { AudioProvider, BookmarkProvider, SettingsProvider } from './contexts';

import type { ReactNode } from 'react';

export const TestWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>{children}</BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);

export default TestWrapper;
