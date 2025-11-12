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

  const { pageType: _pageType, ...contentProps } = props;

  return (
    <BaseSidebar
      isOpen={isSettingsOpen}
      onClose={handleCloseSidebar}
      position="right"
      aria-label="Settings panel"
    >
      <SettingsSidebarContent
        {...contentProps}
        showCloseButton
        onClose={handleCloseSidebar}
      />
    </BaseSidebar>
  );
};
