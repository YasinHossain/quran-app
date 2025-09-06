'use client';

import { useEffect, useReducer, useRef } from 'react';

import { Settings } from '@/types';

import { reducer } from '../settingsReducer';
import { defaultSettings, loadSettings, saveSettings } from '../settingsStorage';

const PERSIST_DEBOUNCE_MS = 300;

export const usePersistentSettings = () => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loaded = loadSettings(defaultSettings);
    hasLoadedFromStorage.current = true;
    dispatch({ type: 'SET_SETTINGS', value: loaded });
    latestSettings.current = loaded;
  }, []);

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
    return () => {
      if (typeof window === 'undefined') return;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        saveSettings(latestSettings.current);
      }
    };
  }, []);

  return { settings, dispatch };
};
