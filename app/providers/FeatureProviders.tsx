'use client';

import React from 'react';
import { SWRConfig } from 'swr';

import { AudioProvider } from '@/app/shared/player/context/AudioContext';

import { ReaderModeProvider } from './ReaderModeContext';
import { SidebarProvider } from './SidebarContext';
import { UIStateProvider } from './UIStateContext';

import type { SWRConfiguration } from 'swr';

const SWR_OPTIONS: SWRConfiguration = {
  dedupingInterval: 2000,
  revalidateOnFocus: false,
  revalidateIfStale: false,
  keepPreviousData: true,
};

export function FeatureProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <SWRConfig value={SWR_OPTIONS}>
      <UIStateProvider>
        <ReaderModeProvider>
          <SidebarProvider>
            <AudioProvider>{children}</AudioProvider>
          </SidebarProvider>
        </ReaderModeProvider>
      </UIStateProvider>
    </SWRConfig>
  );
}
