import { useMemo } from 'react';

import { cn } from '@/lib/utils/cn';

import type { ComponentVariant } from '@/lib/responsive';

interface UseLayoutStylesOptions {
  variant: ComponentVariant;
  showNavigation: boolean;
  sidebarOpen: boolean;
  hasSidebar: boolean;
}

interface LayoutStyles {
  getContentPadding: () => string;
  getSidebarClasses: () => string;
  getContainerClasses: () => string;
}

interface SidebarClassesOptions {
  variant: ComponentVariant;
  sidebarOpen: boolean;
  hasSidebar: boolean;
}

const useContentPadding = (variant: ComponentVariant, showNavigation: boolean): string =>
  useMemo(() => {
    if (!showNavigation) return '';
    return variant === 'expanded' ? '' : 'bottom-nav-space';
  }, [variant, showNavigation]);

const useSidebarClasses = ({ variant, sidebarOpen, hasSidebar }: SidebarClassesOptions): string =>
  useMemo(() => {
    if (!hasSidebar) return '';

    const baseClasses = 'bg-surface border-border shadow-modal transition-transform duration-300';

    switch (variant) {
      case 'compact':
        return cn(
          baseClasses,
          'fixed bottom-0 left-0 right-0 max-h-[70dvh] rounded-t-2xl border-t',
          sidebarOpen ? 'translate-y-0' : 'translate-y-full'
        );
      case 'default':
        return cn(
          baseClasses,
          'fixed top-reader-header right-0 bottom-0 w-reader-sidebar-right border-l rounded-tl-2xl',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        );
      case 'expanded':
        return cn(
          baseClasses,
          'static h-full w-reader-sidebar-right border rounded-xl',
          sidebarOpen ? 'block' : 'hidden'
        );
      default:
        return baseClasses;
    }
  }, [variant, sidebarOpen, hasSidebar]);

const useContainerClasses = (variant: ComponentVariant): string =>
  useMemo(() => cn('flex', variant === 'expanded' ? 'flex-row' : 'flex-col'), [variant]);

export const useLayoutStyles = ({
  variant,
  showNavigation,
  sidebarOpen,
  hasSidebar,
}: UseLayoutStylesOptions): LayoutStyles => {
  const contentPadding = useContentPadding(variant, showNavigation);
  const sidebarClasses = useSidebarClasses({ variant, sidebarOpen, hasSidebar });
  const containerClasses = useContainerClasses(variant);

  return {
    getContentPadding: () => contentPadding,
    getSidebarClasses: () => sidebarClasses,
    getContainerClasses: () => containerClasses,
  };
};
