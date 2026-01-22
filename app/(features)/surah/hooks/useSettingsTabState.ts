import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  // Initialize with override value directly to prevent flash
  const [activeTab, setActiveTab] = useState<TabValue>(activeTabOverride ?? 'translation');

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

  // Sync when activeTabOverride changes externally (e.g., user switches surah while in mushaf mode)
  useEffect(() => {
    if (activeTabOverride && activeTabOverride !== activeTab) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride, activeTab]);

  const tabOptions: TabOption[] = [
    { value: 'translation', label: t('translations') },
    { value: 'reading', label: t('mushaf') },
  ];

  return {
    activeTab,
    handleTabChange,
    tabOptions,
  };
};
