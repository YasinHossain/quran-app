'use client';
import { useMemo, useState } from 'react';
import { TranslationResource } from '@/types';
import { TranslationPanel } from '@/app/(features)/surah/[surahId]/components/TranslationPanel';

interface TranslationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  translationOptions: TranslationResource[];
}

export const TranslationSelector = ({
  isOpen,
  onClose,
  translationOptions,
}: TranslationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const groupedTranslations = useMemo(
    () =>
      translationOptions
        .filter((o) => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce<Record<string, TranslationResource[]>>((acc, tr) => {
          (acc[tr.language_name] ||= []).push(tr);
          return acc;
        }, {}),
    [translationOptions, searchTerm]
  );

  return (
    <TranslationPanel
      isOpen={isOpen}
      onClose={onClose}
      groupedTranslations={groupedTranslations}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    />
  );
};

export default TranslationSelector;
