'use client';
import React, { memo } from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { cn } from '@/lib/utils/cn';

import { HeaderActions } from './components/header/HeaderActions';
import { HeaderBrand } from './components/header/HeaderBrand';
import { HeaderSearch } from './components/header/HeaderSearch';
export const Header = memo(function Header(): React.JSX.Element {
  const { isHidden } = useHeaderVisibility();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-[calc(var(--reader-header-height-compact)+var(--reader-safe-area-top))] sm:h-[calc(var(--reader-header-height)+var(--reader-safe-area-top))] z-header transition-all duration-300',
        'backdrop-blur-lg bg-surface/8 backdrop-saturate-150',
        'border-b border-border shadow-card',
        'flex items-center justify-center',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Content container centered within available height */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full h-14 sm:h-16 px-4 sm:px-6 lg:px-8">
        <HeaderBrand />
        <HeaderSearch />
        <HeaderActions />
      </div>
    </header>
  );
});
