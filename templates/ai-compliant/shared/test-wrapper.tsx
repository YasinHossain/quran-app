import { AudioProvider, BookmarkProvider, SettingsProvider } from './contexts';

import type { ReactNode } from 'react';


export const TestWrapper = ({ children }: { children: ReactNode }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>{children}</BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);
