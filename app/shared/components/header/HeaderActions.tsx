'use client';

import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, type ReactElement, useCallback } from 'react';

import { useUIState } from '@/app/providers/UIStateContext';

export const HeaderActions = memo(function HeaderActions(): ReactElement {
  const { setSettingsOpen } = useUIState();
  const pathname = usePathname();

  // Settings sidebar is not present on these pages on PC, so hide the gear icon on mobile too.
  const NO_SETTINGS_SIDEBAR_ROUTES = ['/bookmarks', '/bookmarks/last-read', '/bookmarks/planner'];

  const shouldHideSettings = NO_SETTINGS_SIDEBAR_ROUTES.includes(pathname);

  const openSettings = useCallback((): void => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

  return (
    <div className="flex items-center justify-end gap-2 sm:gap-2.5 w-auto sm:w-1/3 mr-1">
      {/* Settings button */}
      {!shouldHideSettings && (
        <button
          onClick={openSettings}
          className="btn-touch p-2.5 rounded-xl hover:bg-interactive-hover hover:text-accent transition-all duration-200 active:scale-95 xl:hidden flex items-center justify-center"
          aria-label="Open settings"
        >
          <Settings size={18} className="text-muted" />
        </button>
      )}
    </div>
  );
});
