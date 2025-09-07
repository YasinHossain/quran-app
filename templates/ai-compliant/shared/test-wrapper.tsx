import type { ReactNode } from 'react';

import { AudioProvider, BookmarkProvider, SettingsProvider } from './contexts';

export const TestWrapper = ({ children }: { children: ReactNode }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>{children}</BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);
