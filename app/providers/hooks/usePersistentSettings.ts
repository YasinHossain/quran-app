'use client';

import { Dispatch, useEffect, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { reducer } from '@/app/providers/settingsReducer';
import { defaultSettings, loadSettings, saveSettings } from '@/app/providers/settingsStorage';
import {
  applyUiLanguageContentDefaults,
  resolveUiLanguageCode,
  withUiLanguageContentDefaults,
} from '@/app/providers/uiLanguageContentDefaults';

import type { Action } from '@/app/providers/settingsReducer';
import type { Settings } from '@/types';

const PERSIST_DEBOUNCE_MS = 300;

interface UsePersistentSettingsReturn {
  settings: Settings;
  dispatch: Dispatch<Action>;
}

export const usePersistentSettings = (): UsePersistentSettingsReturn => {
  const { i18n } = useTranslation();
  const [settings, dispatch] = useReducer(reducer, defaultSettings);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const uiLanguage = resolveUiLanguageCode(i18n.language);
    const defaultsForLanguage = withUiLanguageContentDefaults(defaultSettings, uiLanguage);
    const loaded = loadSettings(defaultsForLanguage);
    const synced =
      loaded.contentLanguage === uiLanguage ? loaded : applyUiLanguageContentDefaults(loaded, uiLanguage);
    hasLoadedFromStorage.current = true;
    dispatch({ type: 'SET_SETTINGS', value: synced });
    latestSettings.current = synced;
  }, [i18n]);

  useEffect(() => {
    latestSettings.current = settings;
    if (typeof window === 'undefined') return;
    if (!hasLoadedFromStorage.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      saveSettings(settings);
      timeoutRef.current = null;
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [settings]);

  useEffect(() => {
    const handleLanguageChanged = (language: string): void => {
      if (!hasLoadedFromStorage.current) return;

      const uiLanguage = resolveUiLanguageCode(language);
      if (latestSettings.current.contentLanguage === uiLanguage) return;

      const next = applyUiLanguageContentDefaults(latestSettings.current, uiLanguage);
      dispatch({ type: 'SET_SETTINGS', value: next });
      latestSettings.current = next;
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      if (typeof window === 'undefined') return;
      i18n.off('languageChanged', handleLanguageChanged);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        saveSettings(latestSettings.current);
      }
    };
  }, [i18n]);

  return { settings, dispatch };
};
