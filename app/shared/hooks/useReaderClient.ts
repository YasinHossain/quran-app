'use client';

import React, { useEffect, useMemo } from 'react';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useModal } from './useModal';

interface UseReaderClientOptions {
  translationOptions: Array<{ id: string; name: string }>;
  wordLanguageOptions: Array<{ code: string; name: string }>;
  settings: {
    translationId: string;
    wordLanguage: string;
    reciterId: string;
  };
}

interface UseReaderClientReturn {
  // Header visibility
  isHeaderHidden: boolean;

  // Modals/Panels
  translationPanel: ReturnType<typeof useModal>;
  wordLanguagePanel: ReturnType<typeof useModal>;
  tafsirPanel: ReturnType<typeof useModal>;
  settingsPanel: ReturnType<typeof useModal>;

  // Computed values
  selectedTranslationName: string;
  selectedWordLanguageName: string;

  // Effects
  bodyOverflowEffect: () => void;
}

/**
 * Shared hook for reader client components (Surah, Juz, Page)
 * Consolidates common patterns for translation panels, settings, and UI state
 */
export function useReaderClient({
  translationOptions,
  wordLanguageOptions,
  settings,
}: UseReaderClientOptions): UseReaderClientReturn {
  const { isHidden: isHeaderHidden } = useHeaderVisibility();

  // Panel state management
  const translationPanel = useModal();
  const wordLanguagePanel = useModal();
  const tafsirPanel = useModal();
  const settingsPanel = useModal();

  // Computed values for selected options
  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name || 'Select Translation',
    [settings.translationId, translationOptions]
  );

  const selectedWordLanguageName = useMemo(() => {
    const option = wordLanguageOptions.find((o) => o.code === settings.wordLanguage);
    return option?.name || 'English';
  }, [settings.wordLanguage, wordLanguageOptions]);

  // Body overflow effect for full-screen reader
  const bodyOverflowEffect = React.useCallback(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Apply body overflow effect
  useEffect(() => {
    const cleanup = bodyOverflowEffect();
    return cleanup;
  }, [bodyOverflowEffect]);

  return {
    isHeaderHidden,
    translationPanel,
    wordLanguagePanel,
    tafsirPanel,
    settingsPanel,
    selectedTranslationName,
    selectedWordLanguageName,
    bodyOverflowEffect,
  };
}
