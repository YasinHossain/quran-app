'use client';
import { useMemo, useState } from 'react';
import { TranslationResource } from '@/types';
import { TranslationPanel } from '@/app/(features)/surah/[surahId]/components/TranslationPanel';

interface TranslationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationSelector = ({ isOpen, onClose }: TranslationSelectorProps) => {
  return <TranslationPanel isOpen={isOpen} onClose={onClose} />;
};

export default TranslationSelector;
