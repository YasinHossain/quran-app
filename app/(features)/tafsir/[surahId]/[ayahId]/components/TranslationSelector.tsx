'use client';
import { TranslationPanel } from '@/app/(features)/surah/components';

interface TranslationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationSelector = ({ isOpen, onClose }: TranslationSelectorProps) => {
  return <TranslationPanel isOpen={isOpen} onClose={onClose} />;
};

export default TranslationSelector;
