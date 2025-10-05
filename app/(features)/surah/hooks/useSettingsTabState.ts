import { useState, useCallback } from 'react';

interface UseSettingsTabStateProps {
  onReadingPanelOpen?: () => void;
}

type TabOption = { value: 'translation' | 'reading'; label: string };
interface ReturnShape {
  activeTab: 'translation' | 'reading';
  handleTabChange: (tab: 'translation' | 'reading') => void;
  tabOptions: TabOption[];
}

export const useSettingsTabState: (args?: UseSettingsTabStateProps) => ReturnShape = ({
  onReadingPanelOpen,
}: UseSettingsTabStateProps = {}) => {
  const [activeTab, setActiveTab] = useState<'translation' | 'reading'>('translation');

  const handleTabChange = useCallback(
    (tab: 'translation' | 'reading') => {
      setActiveTab(tab);
      if (tab === 'reading') {
        onReadingPanelOpen?.();
      }
    },
    [onReadingPanelOpen]
  );

  const tabOptions: TabOption[] = [
    { value: 'translation', label: 'Translation' },
    { value: 'reading', label: 'Mushaf' },
  ];

  return {
    activeTab,
    handleTabChange,
    tabOptions,
  };
};
