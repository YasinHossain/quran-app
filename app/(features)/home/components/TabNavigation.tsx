'use client';

import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TabButton } from './TabButton';

type TabType = 'surah' | 'juz';

interface TabConfig {
  id: TabType;
  label: string;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Tab navigation component with consistent button styling
 * Maps over tab configurations to reduce repetition
 */
export const TabNavigation = memo(function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const { t } = useTranslation();
  const tabs = useMemo<TabConfig[]>(
    () => [
      { id: 'surah', label: t('surah_tab') },
      { id: 'juz', label: t('juz_tab') },
    ],
    [t]
  );

  return (
    <div className="flex items-center p-1 sm:p-2 rounded-full bg-interactive flex-shrink-0">
      {tabs.map((tab) => (
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
