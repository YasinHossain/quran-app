'use client';

import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, type ReactElement, useCallback } from 'react';

import { useUIState } from '@/app/providers/UIStateContext';

export const HeaderActions = memo(function HeaderActions(): ReactElement {
  const { setSettingsOpen } = useUIState();
  const pathname = usePathname();

  // These pages have NO settings sidebar at all (not even on desktop 2xl),
  // so we should hide the gear icon completely and show a placeholder for centering
  const NO_SETTINGS_PAGES = ['/bookmarks/folders', '/bookmarks/last-read', '/bookmarks/planner', '/bookmarks'];

  // Check for exact match or if it starts with bookmarks but is not pinned/folder detail
  const isNoSettingsPage = NO_SETTINGS_PAGES.includes(pathname) ||
    (pathname === '/bookmarks');

  const openSettings = useCallback((): void => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

  // Pages with no settings sidebar at all - show placeholder for centering at all sizes
  // On mobile (< xl): show 44px placeholder to match hamburger menu button
  // On desktop (>= sm): use w-1/3 to match HeaderBrand's w-1/3
  if (isNoSettingsPage) {
    return (
      <div
        className="w-11 h-11 sm:w-1/3 shrink-0"
        aria-hidden="true"
      />
    );
  }

  // Pages that have settings sidebar (shows at 2xl) - show gear icon below 2xl
  return (
    <div className="flex items-center justify-end gap-2 sm:gap-2.5 w-auto sm:w-1/3 mr-1">
      {/* Settings button - visible when settings sidebar is hidden (< 2xl) */}
      <button
        onClick={openSettings}
        className="btn-touch p-2.5 rounded-xl hover:bg-interactive-hover hover:text-accent transition-all duration-200 active:scale-95 2xl:hidden flex items-center justify-center"
        aria-label="Open settings"
      >
        <Settings size={18} className="text-muted" />
      </button>
    </div>
  );
});

