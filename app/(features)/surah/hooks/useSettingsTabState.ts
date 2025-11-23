import { useState, useCallback, useEffect } from 'react';

interface UseSettingsTabStateProps {
  onReadingPanelOpen?: () => void;
  onTranslationTabOpen?: () => void;
  activeTabOverride?: 'translation' | 'reading';
}

type TabValue = 'translation' | 'reading';
type TabOption = { value: TabValue; label: string };
interface ReturnShape {
  activeTab: TabValue;
  handleTabChange: (tab: TabValue) => void;
  tabOptions: TabOption[];
}

export const useSettingsTabState: (args?: UseSettingsTabStateProps) => ReturnShape = ({
  onReadingPanelOpen,
  onTranslationTabOpen,
  activeTabOverride,
}: UseSettingsTabStateProps = {}) => {
  const [activeTab, setActiveTab] = useState<TabValue>('translation');

  const handleTabChange = useCallback(
    (tab: TabValue) => {
      setActiveTab(tab);
      if (tab === 'reading') {
        onReadingPanelOpen?.();
      } else if (tab === 'translation') {
        onTranslationTabOpen?.();
      }
    },
    [onReadingPanelOpen, onTranslationTabOpen]
  );

  useEffect(() => {
    if (activeTabOverride && activeTabOverride !== activeTab) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride, activeTab]);

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
