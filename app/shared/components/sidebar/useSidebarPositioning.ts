import { cn } from '@/lib/utils/cn';

type DesktopBreakpoint = 'lg' | 'xl' | '2xl';

interface UseSidebarPositioningOptions {
  position: 'left' | 'right';
  isOpen: boolean;
  isHeaderHidden: boolean;
  desktopBreakpoint?: DesktopBreakpoint;
}

interface UseSidebarPositioningReturn {
  getPositionClasses(): string;
}

export const useSidebarPositioning = ({
  position,
  isOpen,
  isHeaderHidden,
  desktopBreakpoint = 'lg',
}: UseSidebarPositioningOptions): UseSidebarPositioningReturn => {
  const breakpointClass =
    desktopBreakpoint === 'lg' ? 'lg' : desktopBreakpoint === 'xl' ? 'xl' : '2xl';
  const getPositionClasses = (): string => {
    const baseClasses = cn(
      // Use !fixed to avoid being overridden by any accidental 'relative'
      '!fixed w-full bg-surface transition-transform duration-300 ease-in-out transform-gpu',
      isOpen && 'will-change-transform',
      'sm:w-80',
      position === 'left'
        ? [
            'lg:w-reader-sidebar-left',
            desktopBreakpoint === 'xl' && 'xl:w-reader-sidebar-left',
            desktopBreakpoint === '2xl' && '2xl:w-reader-sidebar-left',
          ]
        : [
            'lg:w-reader-sidebar-right',
            desktopBreakpoint === 'xl' && 'xl:w-reader-sidebar-right',
            desktopBreakpoint === '2xl' && '2xl:w-reader-sidebar-right',
          ]
    );
    const headerAwareClasses = isHeaderHidden
      ? 'top-0 h-dvh'
      : cn(
          'top-0 h-dvh',
          breakpointClass === 'lg'
            ? 'lg:top-reader-header lg:h-[calc(100dvh-var(--reader-header-height))]'
            : breakpointClass === 'xl'
              ? 'xl:top-reader-header xl:h-[calc(100dvh-var(--reader-header-height))]'
              : '2xl:top-reader-header 2xl:h-[calc(100dvh-var(--reader-header-height))]'
        );

    const shadowClasses = isOpen
      ? position === 'left'
        ? breakpointClass === 'lg'
          ? 'mobile-sidebar-shadow-right lg:shadow-none'
          : breakpointClass === 'xl'
            ? 'mobile-sidebar-shadow-right xl:shadow-none'
            : 'mobile-sidebar-shadow-right 2xl:shadow-none'
        : breakpointClass === 'lg'
          ? 'mobile-sidebar-shadow-left lg:shadow-none'
          : breakpointClass === 'xl'
            ? 'mobile-sidebar-shadow-left xl:shadow-none'
            : 'mobile-sidebar-shadow-left 2xl:shadow-none'
      : '';
    const panelZIndex = 'z-[120]';
    const pinnedTranslateClass = `${breakpointClass}:translate-x-0`;

    if (position === 'left') {
      return cn(
        baseClasses,
        'left-0',
        breakpointClass === 'lg'
          ? 'lg:left-16'
          : breakpointClass === 'xl'
            ? 'xl:left-16'
            : '2xl:left-16',
        shadowClasses,
        headerAwareClasses,
        panelZIndex,
        isOpen ? 'translate-x-0' : '-translate-x-full',
        pinnedTranslateClass
      );
    }
    return cn(
      baseClasses,
      'right-0',
      shadowClasses,
      headerAwareClasses,
      panelZIndex,
      isOpen ? 'translate-x-0' : 'translate-x-full',
      pinnedTranslateClass
    );
  };

  return { getPositionClasses };
};
