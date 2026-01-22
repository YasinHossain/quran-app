'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils/cn';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'bn', label: 'Bangla', nativeLabel: 'বাংলা' },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

const LOCAL_STORAGE_KEY = 'ui-language';

interface LanguageButtonProps {
  language: (typeof LANGUAGES)[number];
  currentLanguage: LanguageCode;
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
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isClient, setIsClient] = useState(false);

  // Initialize language from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY) as LanguageCode | null;
    if (savedLanguage && LANGUAGES.some((lang) => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      setCurrentLanguage(i18n.language as LanguageCode);
    }
  }, [i18n]);

  const handleLanguageChange = useCallback(
    (languageCode: LanguageCode): void => {
      i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      localStorage.setItem(LOCAL_STORAGE_KEY, languageCode);

      // Update document lang attribute for accessibility
      document.documentElement.lang = languageCode;
    },
    [i18n]
  );

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
        {LANGUAGES.map((language) => (
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
      onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
      className={cn(
        'min-h-touch px-3 py-2 rounded-lg bg-interactive border border-border text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-accent',
        className
      )}
      aria-label="Select language"
    >
      {LANGUAGES.map((language) => (
        <option key={language.code} value={language.code}>
          {language.nativeLabel}
        </option>
      ))}
    </select>
  );
});
