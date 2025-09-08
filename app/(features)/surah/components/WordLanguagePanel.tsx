'use client';

import { useTranslation } from 'react-i18next';

import { useWordLanguageSelection } from '@/app/(features)/surah/hooks';

import { LanguageList } from './LanguageList';
import { PanelHeader } from './PanelHeader';

interface WordLanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  renderMode?: 'panel' | 'content'; // 'panel' for slide-over, 'content' for inline in sidebar
}

export const WordLanguagePanel = ({
  isOpen,
  onClose,
  renderMode = 'panel',
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
    <div
      data-testid="word-language-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-background text-foreground`}
    >
      <PanelHeader title={t('word_by_word_panel_title')} onClose={onClose} />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4 pt-4">
            <LanguageList selectedId={selectedId} onSelect={handleLanguageSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};
