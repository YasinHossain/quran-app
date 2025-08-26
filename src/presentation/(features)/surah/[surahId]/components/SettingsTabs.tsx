'use client';

import React from 'react';
import { TabToggle } from '@/presentation/shared/ui/TabToggle';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabOptions: Array<{ value: string; label: string }>;
}

export const SettingsTabs = ({ activeTab, onTabChange, tabOptions }: SettingsTabsProps) => {
  return <TabToggle options={tabOptions} value={activeTab} onChange={onTabChange} />;
};
