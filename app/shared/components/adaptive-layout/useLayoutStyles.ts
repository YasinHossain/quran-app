import { cn } from '@/lib/utils/cn';

import type { ResponsiveVariant } from '@/lib/responsive';

interface UseLayoutStylesOptions {
  variant: ResponsiveVariant;
  showNavigation: boolean;
  sidebarOpen: boolean;
  hasSidebar: boolean;
}

interface LayoutStyles {
  getContentPadding: () => string;
  getSidebarClasses: () => string;
  getContainerClasses: () => string;
}

export const useLayoutStyles = ({
  variant,
  showNavigation,
  sidebarOpen,
  hasSidebar,
}: UseLayoutStylesOptions): LayoutStyles => {
  const getContentPadding = (): string => {
    if (!showNavigation) return '';

    switch (variant) {
      case 'compact':
        return 'bottom-nav-space';
      case 'default':
        return 'bottom-nav-space';
      case 'expanded':
        return '';
      default:
        return 'bottom-nav-space';
    }
  };

  const getSidebarClasses = (): string => {
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
          'fixed top-16 right-0 bottom-0 w-80 border-l rounded-tl-2xl',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        );

      case 'expanded':
        return cn(
          baseClasses,
          'static w-80 h-full border rounded-xl',
          sidebarOpen ? 'block' : 'hidden'
        );

      default:
        return baseClasses;
    }
  };

  const getContainerClasses = (): string =>
    cn('flex', variant === 'expanded' ? 'flex-row' : 'flex-col');

  return {
    getContentPadding,
    getSidebarClasses,
    getContainerClasses,
  };
};
