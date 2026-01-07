'use client';

import { memo, type ReactElement } from 'react';

import { ComprehensiveSearch } from '@/app/shared/search';

/**
 * Header search component for Surah page and other headers.
 * Uses the comprehensive search with compact header variant.
 */
export const HeaderSearch = memo(function HeaderSearch(): ReactElement {
  return (
    <div className="flex items-center justify-center flex-1 sm:flex-none sm:w-1/3">
      <div className="w-full max-w-[55vw] sm:max-w-sm lg:max-w-md relative" role="presentation">
        <ComprehensiveSearch variant="header" placeholder="Search verses, surahs..." />
      </div>
    </div>
  );
});
