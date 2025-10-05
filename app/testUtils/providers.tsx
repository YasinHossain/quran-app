import React, { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

export const ContextProviders = {
  Settings: SettingsProvider,
  Audio: AudioProvider,
  Bookmark: BookmarkProvider,
  Theme: ThemeProvider,
  Sidebar: SidebarProvider,
};

export type ContextProviderName = keyof typeof ContextProviders;

export function createProviderWrapper(
  providers: ContextProviderName[],
  swrConfig?: object
): React.ComponentType<{ children: ReactNode }> {
  return ({ children }) => {
    let wrapped = children;

    if (swrConfig) {
      wrapped = <SWRConfig value={swrConfig}>{wrapped}</SWRConfig>;
    }

    providers.reverse().forEach((providerName) => {
      const Provider = ContextProviders[providerName];
      wrapped = <Provider>{wrapped}</Provider>;
    });

    return <>{wrapped}</>;
  };
}
