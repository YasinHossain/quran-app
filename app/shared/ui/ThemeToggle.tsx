'use client';

import React, { memo } from 'react';

import { useTheme } from '@/app/providers/ThemeContext';
import { SunIcon, MoonIcon } from '@/app/shared/icons';

import { Button } from './Button';

interface ThemeToggleProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'tabs' | string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

interface ThemeTabButtonProps {
  theme: 'light' | 'dark';
  currentTheme: 'light' | 'dark';
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ThemeTabButton = memo(function ThemeTabButton({
  theme,
  currentTheme,
  onClick,
  icon,
  label,
}: ThemeTabButtonProps): React.JSX.Element {
  const isActive = currentTheme === theme;
  const buttonClass = isActive
    ? 'bg-surface shadow text-foreground'
    : 'text-muted hover:text-foreground hover:bg-surface/50';

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold transition-colors ${buttonClass}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
});

interface TabsVariantProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  className?: string;
}

const TabsVariant = memo(function TabsVariant({
  currentTheme,
  onThemeChange,
  className,
}: TabsVariantProps): React.JSX.Element {
  return (
    <div
      className={`flex items-center p-1 rounded-full bg-interactive border border-border ${className || ''}`}
    >
      <ThemeTabButton
        theme="light"
        currentTheme={currentTheme}
        onClick={() => onThemeChange('light')}
        icon={<SunIcon className="w-4 h-4" />}
        label="Light theme"
      />
      <ThemeTabButton
        theme="dark"
        currentTheme={currentTheme}
        onClick={() => onThemeChange('dark')}
        icon={<MoonIcon className="w-4 h-4" />}
        label="Dark theme"
      />
    </div>
  );
});

interface ButtonVariantProps {
  currentTheme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

const ButtonVariant = memo(function ButtonVariant({
  currentTheme,
  onToggle,
  className,
}: ButtonVariantProps): React.JSX.Element {
  return (
    <Button
      variant="icon-round"
      size="icon"
      onClick={onToggle}
      className={`bg-button-secondary/40 hover:bg-button-secondary-hover/60 ${className || ''}`}
      aria-label="Toggle Theme"
    >
      {currentTheme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-accent" />
      ) : (
        <MoonIcon className="w-5 h-5 text-accent" />
      )}
    </Button>
  );
});

export const ThemeToggle = memo(function ThemeToggle({
  variant = 'ghost',
  className,
}: ThemeToggleProps): React.JSX.Element {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect((): void => {
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');
  }, []);

  const handleThemeChange = React.useCallback(
    (theme: 'light' | 'dark'): void => {
      setTheme(theme);
      setCurrentTheme(theme);
    },
    [setTheme]
  );

  const toggleTheme = React.useCallback((): void => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }, [setTheme]);

  if (variant === 'tabs') {
    return (
      <TabsVariant
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        className={className}
      />
    );
  }

  return <ButtonVariant currentTheme={currentTheme} onToggle={toggleTheme} className={className} />;
});
