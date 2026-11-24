'use client';

import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { buildLocaleSwitchHref, getLocaleFromPathname } from '@/app/shared/i18n/localeRouting';
import { setUiLanguage } from '@/app/shared/i18n/setUiLanguage';
import {
  DEFAULT_UI_LANGUAGE,
  UI_LANGUAGES,
  isUiLanguageCode,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
import { ensureUiResourcesLoaded } from '@/app/shared/i18n/uiResourcesClient';
import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';
import { cn } from '@/lib/utils/cn';

interface LanguageButtonProps {
  language: (typeof UI_LANGUAGES)[number];
  currentLanguage: UiLanguageCode;
  onClick: () => void;
  onPrefetch?: () => void;
}

const LanguageButton = memo(function LanguageButton({
  language,
  currentLanguage,
  onClick,
  onPrefetch,
}: LanguageButtonProps): React.JSX.Element {
  const isActive = currentLanguage === language.code;
  const buttonClass = isActive
    ? 'bg-surface shadow text-foreground'
    : 'text-muted hover:text-foreground hover:bg-surface/50';

  return (
    <button
      onClick={onClick}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
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
  const router = useRouter();
  const pathname = usePublicPathname();
  const [currentLanguage, setCurrentLanguage] = useState<UiLanguageCode>('en');
  const [isClient, setIsClient] = useState(false);

  // Initialize language from localStorage on mount
  useEffect(() => {
    setIsClient(true);

    const fromPath = getLocaleFromPathname(pathname);
    if (fromPath) {
      setCurrentLanguage(fromPath);
      return;
    }

    const initial =
      typeof i18n?.language === 'string' && isUiLanguageCode(i18n.language)
        ? i18n.language
        : DEFAULT_UI_LANGUAGE;
    setCurrentLanguage(initial);
  }, [i18n, pathname]);

  const prefetchUiLanguage = useCallback(
    (languageCode: UiLanguageCode): void => {
      void ensureUiResourcesLoaded(i18n, languageCode).catch(() => {});
    },
    [i18n]
  );

  const handleLanguageChange = useCallback(
    (languageCode: UiLanguageCode): void => {
      if (languageCode === currentLanguage) return;
      const nextHref = buildLocaleSwitchHref(pathname, languageCode);
      setUiLanguage(i18n, languageCode);
      setCurrentLanguage(languageCode);
      router.replace(nextHref);
    },
    [currentLanguage, i18n, pathname, router]
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
        {UI_LANGUAGES.map((language) => (
          <LanguageButton
            key={language.code}
            language={language}
            currentLanguage={currentLanguage}
            onClick={() => handleLanguageChange(language.code)}
            onPrefetch={() => prefetchUiLanguage(language.code)}
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
