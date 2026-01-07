'use client';

import { useTranslation } from 'react-i18next';

import { useWordLanguageSelection } from '@/app/(features)/surah/hooks';
import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';

import { LanguageList } from './LanguageList';

interface WordLanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  renderMode?: 'panel' | 'content'; // 'panel' for slide-over, 'content' for inline in sidebar
  onCloseSidebar?: () => void;
}

export const WordLanguagePanel = ({
  isOpen,
  onClose,
  renderMode = 'panel',
  onCloseSidebar,
}: WordLanguagePanelProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { selectedId, handleLanguageSelect } = useWordLanguageSelection();

  if (renderMode === 'content') {
    return (
      <div className="flex-grow p-4 space-y-4">
        <LanguageList selectedId={selectedId} onSelect={handleLanguageSelect} />
      </div>
    );
  }

  return (
    <SlideOverPanel isOpen={isOpen} testId="word-language-panel">
      <SettingsPanelHeader
        title={t('word_by_word_panel_title')}
        onClose={onClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
        backIconClassName="h-6 w-6 text-foreground"
      />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4 pt-4">
            <LanguageList selectedId={selectedId} onSelect={handleLanguageSelect} />
          </div>
        </div>
      </div>
    </SlideOverPanel>
  );
};
