'use client';

import { memo } from 'react';

import { TabButton } from './TabButton';

type TabType = 'Surah' | 'Juz' | 'Page';

interface TabConfig {
  id: TabType;
  label: string;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_CONFIGS: TabConfig[] = [
  { id: 'Surah', label: 'Surah' },
  { id: 'Juz', label: 'Juz' },
  { id: 'Page', label: 'Page' },
];

/**
 * Tab navigation component with consistent button styling
 * Maps over tab configurations to reduce repetition
 */
export const TabNavigation = memo(function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex items-center p-1 sm:p-2 rounded-full bg-interactive">
      {TAB_CONFIGS.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
});
