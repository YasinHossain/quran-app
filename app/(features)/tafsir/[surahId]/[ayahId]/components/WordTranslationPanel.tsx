'use client';
import { useTranslation } from 'react-i18next';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SearchInput } from '@/app/shared/components/SearchInput';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';

import { useWordTranslationSearch, type LanguageOption } from './useWordTranslationSearch';
import { WordTranslationList } from './WordTranslationList';

interface WordTranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  languages: LanguageOption[];
  onReset: () => void;
}

export const WordTranslationPanel = ({
  isOpen,
  onClose,
  languages,
  onReset,
}: WordTranslationPanelProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();
  const { searchTerm, setSearchTerm, filteredLanguages } = useWordTranslationSearch(languages);

  return (
    <div
      className={`fixed pt-safe pb-safe ${isHidden ? 'top-0' : 'top-16'} bottom-0 right-0 w-full sm:w-80 lg:w-80 bg-surface text-foreground flex flex-col transition-all duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="icon-round" size="icon" aria-label="Back" onClick={onClose}>
          <ArrowLeftIcon size={18} />
        </Button>
        <h2 className="font-bold text-lg text-foreground">{t('word_by_word_panel_title')}</h2>
        <div className="w-8"></div>
      </div>
      <div className="p-3 border-b border-border">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('search')}
          variant="default"
          size="md"
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <WordTranslationList languages={filteredLanguages} onSelect={onClose} />
      </div>
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            onReset();
            onClose();
          }}
          className="w-full py-2.5 rounded-lg border border-border text-sm hover:border-accent"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};
