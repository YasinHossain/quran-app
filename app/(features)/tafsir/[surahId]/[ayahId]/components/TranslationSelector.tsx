'use client';
import { TranslationPanel } from '@/app/(features)/surah/components';

interface TranslationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationSelector = ({
  isOpen,
  onClose,
}: TranslationSelectorProps): React.JSX.Element => {
  return <TranslationPanel isOpen={isOpen} onClose={onClose} />;
};
