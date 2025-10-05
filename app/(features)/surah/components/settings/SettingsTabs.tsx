'use client';

import React from 'react';

import { TabToggle } from '@/app/shared/ui/TabToggle';

import type { SettingsTabValue } from './types';
import type { ReactElement } from 'react';

interface SettingsTabsProps {
  activeTab: SettingsTabValue;
  onTabChange: (tab: SettingsTabValue) => void;
  tabOptions: Array<{ value: SettingsTabValue; label: string }>;
}

export const SettingsTabs = ({
  activeTab,
  onTabChange,
  tabOptions,
}: SettingsTabsProps): ReactElement => {
  return (
    <TabToggle
      options={tabOptions}
      value={activeTab}
      onChange={(value) => onTabChange(value as SettingsTabValue)}
    />
  );
};
