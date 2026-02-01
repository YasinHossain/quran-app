'use client';
import * as Popover from '@radix-ui/react-popover';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/app/providers/ThemeContext';
import { setLocaleInPathnameForSwitch } from '@/app/shared/i18n/localeRouting';
import { setUiLanguage } from '@/app/shared/i18n/setUiLanguage';
import {
  getUiLanguageLabel,
  isUiLanguageCode,
  UI_LANGUAGES,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
import { ensureUiResourcesLoaded } from '@/app/shared/i18n/uiResourcesClient';
import { CheckIcon, ChevronDownIcon, GlobeIcon, MoonIcon, SunIcon } from '@/app/shared/icons';

interface HomeHeaderProps {
  className?: string;
}

/**
 * Header component for the home page with theme toggle functionality.
 * Implements mobile-first responsive design and performance optimization.
 */
export const HomeHeader = memo(function HomeHeader({ className }: HomeHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const selectedCode: UiLanguageCode = isUiLanguageCode(i18n.language) ? i18n.language : 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!languageMenuOpen) return;
    UI_LANGUAGES.forEach((language) => {
      void ensureUiResourcesLoaded(i18n, language.code).catch(() => {});
    });
  }, [i18n, languageMenuOpen]);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    html.classList.toggle('dark', nextTheme === 'dark');
    html.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  }, [setTheme, theme]);

  return (
    <header className={`w-full py-4 ${className || ''}`}>
      <div className="mx-auto w-full" style={{ maxWidth: 'clamp(20rem, 98vw, 90rem)' }}>
        <div className="rounded-xl bg-surface-navigation border border-border/30 dark:border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-3">
          <nav className="flex justify-between items-center space-y-0">
            {mounted ? (
              <Popover.Root open={languageMenuOpen} onOpenChange={setLanguageMenuOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="min-h-touch px-3 py-2 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation flex items-center gap-2"
                    aria-label={t('language_setting')}
                  >
                    <GlobeIcon size={20} className="text-foreground" />
                    <span className="text-base sm:text-lg md:text-lg font-semibold tracking-wide text-content-primary">
                      {getUiLanguageLabel(selectedCode)}
                    </span>
                    <ChevronDownIcon size={16} className="text-muted shrink-0" aria-hidden="true" />
                  </button>
                </Popover.Trigger>
                <Popover.Content
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="min-w-40 rounded-xl shadow-lg bg-surface-navigation p-1 z-[200] overflow-hidden"
                >
                  <div className="flex flex-col">
                    {UI_LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => {
                          if (selectedCode === language.code) return;
                          const query = searchParams.toString();
                          const hash = typeof window !== 'undefined' ? window.location.hash : '';
                          const nextPath = setLocaleInPathnameForSwitch(pathname, language.code);
                          setUiLanguage(i18n, language.code);
                          router.replace(`${nextPath}${query ? `?${query}` : ''}${hash}`);
                          setLanguageMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-interactive-hover transition-colors"
                      >
                        <span className="truncate">{language.nativeLabel}</span>
                        {selectedCode === language.code && (
                          <CheckIcon size={16} className="text-foreground shrink-0" aria-hidden />
                        )}
                      </button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Root>
            ) : (
              <button
                type="button"
                className="min-h-touch px-3 py-2 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation flex items-center gap-2"
                aria-label={t('language_setting')}
                aria-disabled="true"
              >
                <GlobeIcon size={20} className="text-foreground" />
                <span className="text-base sm:text-lg md:text-lg font-semibold tracking-wide text-content-primary">
                  {getUiLanguageLabel(selectedCode)}
                </span>
                <ChevronDownIcon size={16} className="text-muted shrink-0" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="min-h-touch min-w-touch p-1.5 bg-button-secondary/40 rounded-full hover:bg-button-secondary-hover/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-manipulation flex items-center justify-center"
              aria-label={theme === 'dark' ? t('switch_to_light') : t('switch_to_dark')}
            >
              <span className="theme-toggle-icon--dark" aria-hidden="true">
                <SunIcon className="w-5 h-5 text-foreground" />
              </span>
              <span className="theme-toggle-icon--light" aria-hidden="true">
                <MoonIcon className="w-5 h-5 text-foreground" />
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
});
