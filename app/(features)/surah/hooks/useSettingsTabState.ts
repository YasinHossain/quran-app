import { useState, useCallback } from 'react';

interface UseSettingsTabStateProps {
  onReadingPanelOpen?: () => void;
}

export const useSettingsTabState = ({ onReadingPanelOpen }: UseSettingsTabStateProps = {}) => {
  const [activeTab, setActiveTab] = useState('translation');

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === 'reading') {
        onReadingPanelOpen?.();
      }
    },
    [onReadingPanelOpen]
  );

  const tabOptions = [
    { value: 'translation', label: 'Translation' },
    { value: 'reading', label: 'Mushaf' },
  ];

  return {
    activeTab,
    handleTabChange,
    tabOptions,
  };
};

export default useSettingsTabState;
