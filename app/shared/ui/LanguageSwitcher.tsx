'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setUiLanguage } from '@/app/shared/i18n/setUiLanguage';
import {
  UI_LANGUAGES,
  UI_LANGUAGE_STORAGE_KEY,
  isUiLanguageCode,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
import { cn } from '@/lib/utils/cn';

interface LanguageButtonProps {
  language: (typeof UI_LANGUAGES)[number];
  currentLanguage: UiLanguageCode;
  onClick: () => void;
}

const LanguageButton = memo(function LanguageButton({
  language,
  currentLanguage,
  onClick,
}: LanguageButtonProps): React.JSX.Element {
  const isActive = currentLanguage === language.code;
  const buttonClass = isActive
    ? 'bg-surface shadow text-foreground'
    : 'text-muted hover:text-foreground hover:bg-surface/50';

  return (
    <button
      onClick={onClick}
      className={cn(
        'min-h-touch min-w-touch flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold transition-colors touch-manipulation',
        buttonClass
      )}
      aria-label={`Switch to ${language.label}`}
      aria-pressed={isActive}
    >
      {language.nativeLabel}
    </button>
  );
});

interface LanguageSwitcherProps {
  variant?: 'tabs' | 'dropdown';
  className?: string;
}

export const LanguageSwitcher = memo(function LanguageSwitcher({
  variant = 'tabs',
  className,
}: LanguageSwitcherProps): React.JSX.Element {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<UiLanguageCode>('en');
  const [isClient, setIsClient] = useState(false);

  // Initialize language from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY) as UiLanguageCode | null;
    if (savedLanguage && UI_LANGUAGES.some((lang) => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      setUiLanguage(i18n, savedLanguage);
    } else {
      const initial =
        typeof i18n?.language === 'string' && isUiLanguageCode(i18n.language)
          ? i18n.language
          : 'en';
      setCurrentLanguage(initial);
    }
  }, [i18n]);

  const handleLanguageChange = useCallback((languageCode: UiLanguageCode): void => {
    setUiLanguage(i18n, languageCode);
    setCurrentLanguage(languageCode);
  }, [i18n]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div
        className={cn(
          'flex items-center p-1 rounded-full bg-interactive border border-border min-h-[48px]',
          className
        )}
      />
    );
  }

  if (variant === 'tabs') {
    return (
      <div
        className={cn(
          'flex items-center p-1 rounded-full bg-interactive border border-border',
          className
        )}
        role="group"
        aria-label="Language selection"
      >
        {UI_LANGUAGES.map((language) => (
          <LanguageButton
            key={language.code}
            language={language}
            currentLanguage={currentLanguage}
            onClick={() => handleLanguageChange(language.code)}
          />
        ))}
      </div>
    );
  }

  // Dropdown variant (for future use if needed)
  return (
    <select
      value={currentLanguage}
      onChange={(e) => {
        const next = e.target.value;
        if (isUiLanguageCode(next)) {
          handleLanguageChange(next);
        }
      }}
      className={cn(
        'min-h-touch px-3 py-2 rounded-lg bg-interactive border border-border text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-accent',
        className
      )}
      aria-label="Select language"
    >
      {UI_LANGUAGES.map((language) => (
        <option key={language.code} value={language.code}>
          {language.nativeLabel}
        </option>
      ))}
    </select>
  );
});
