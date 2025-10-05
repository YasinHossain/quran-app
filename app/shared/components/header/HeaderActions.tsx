'use client';

import { IconSun, IconMoon, IconSettings } from '@tabler/icons-react';
import { memo, type ReactElement, useCallback } from 'react';

import { useTheme } from '@/app/providers/ThemeContext';
import { useUIState } from '@/app/providers/UIStateContext';

export const HeaderActions = memo(function HeaderActions(): ReactElement {
  const { theme, setTheme } = useTheme();
  const { setSettingsOpen } = useUIState();

  const toggleTheme = useCallback((): void => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  }, [setTheme]);

  const openSettings = useCallback((): void => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

  return (
    <div className="flex items-center justify-end space-x-1 sm:space-x-1.5 w-1/3 mr-1">
      {/* Settings button - only show on mobile/tablet when settings sidebar is hidden */}
      <button
        onClick={openSettings}
        className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95 lg:hidden"
        aria-label="Open settings"
      >
        <IconSettings size={18} className="text-muted" />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <IconSun size={18} className="text-accent" />
        ) : (
          <IconMoon size={18} className="text-accent" />
        )}
      </button>
    </div>
  );
});
