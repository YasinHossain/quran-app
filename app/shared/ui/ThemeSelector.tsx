'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/ThemeContext';
import { TabToggle } from './TabToggle';

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: t('light_mode') },
    { value: 'dark', label: t('dark_mode') },
  ];

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark');
  };

  return (
    <TabToggle
      options={themeOptions}
      value={theme}
      onChange={handleThemeChange}
      className={className}
    />
  );
};
