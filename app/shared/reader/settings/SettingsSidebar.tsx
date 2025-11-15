'use client';

import React, { useCallback } from 'react';

import { useUIState } from '@/app/providers/UIStateContext';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';

import { SettingsSidebarContent } from './SettingsSidebarContent';
import { SettingsSidebarProps } from './types';

import type { ReactElement } from 'react';

export const SettingsSidebar = (props: SettingsSidebarProps): ReactElement => {
  const { isSettingsOpen, setSettingsOpen } = useUIState();
  const handleCloseSidebar = useCallback((): void => setSettingsOpen(false), [setSettingsOpen]);

  const { pageType, readerTabsEnabled: readerTabsOverride, ...contentProps } = props;

  const readerTabsEnabled =
    typeof readerTabsOverride === 'boolean' ? readerTabsOverride : pageType === 'verse';

  return (
    <BaseSidebar
      isOpen={isSettingsOpen}
      onClose={handleCloseSidebar}
      position="right"
      aria-label="Settings panel"
    >
      <SettingsSidebarContent
        {...contentProps}
        readerTabsEnabled={readerTabsEnabled}
        showCloseButton
        onClose={handleCloseSidebar}
      />
    </BaseSidebar>
  );
};
