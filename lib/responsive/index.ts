import { useResponsiveFocus } from '@/lib/focus';

import { useBreakpoint, type BreakpointKey } from './breakpoints';
import { useOrientation, type OrientationKey } from './orientation';
import { getVariantForBreakpoint, type ComponentVariant } from './variants';

export * from './breakpoints';
export * from './container';
export * from './orientation';
export * from './variants';

export const responsiveClasses = {
  container: 'w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl',
  stack: 'flex flex-col gap-3 sm:gap-4 lg:gap-6',
  row: 'flex flex-col gap-3 sm:flex-row sm:gap-4 lg:gap-6',
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  heading: 'text-lg font-semibold sm:text-xl lg:text-2xl',
  body: 'text-sm sm:text-base lg:text-lg leading-relaxed',
  caption: 'text-xs sm:text-sm text-muted',
  timeLabel: 'text-[10px] md:text-[11px] tabular-nums text-muted',
  button: 'min-h-touch px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3',
  input: 'min-h-touch px-3 py-2 sm:px-4 sm:py-2.5',
  padding: 'p-3 sm:p-4 lg:p-6 xl:p-8',
  margin: 'm-3 sm:m-4 lg:m-6 xl:m-8',
  gap: 'gap-3 sm:gap-4 lg:gap-6 xl:gap-8',
  timeDisplay: 'min-w-[72px] md:min-w-[88px]',
  nav: 'flex items-center justify-between p-3 sm:p-4 lg:p-6',
  sidebar: 'w-full transition-transform duration-300 sm:w-80 lg:w-reader-sidebar-right',
} as const;

export const iconClasses = {
  xs: 'h-3 w-3 sm:h-3.5 sm:w-3.5',
  sm: 'h-4 w-4 sm:h-4 sm:w-4',
  md: 'h-5 w-5 sm:h-5 sm:w-5',
  lg: 'h-6 w-6 sm:h-6 sm:w-6',
  xl: 'h-8 w-8 sm:h-8 sm:w-8',
  touch: 'h-[18px] w-[18px] sm:h-5 sm:w-5',
  stroke: 'stroke-[1.5] sm:stroke-[1.75]',
} as const;

export const touchClasses = {
  target: 'min-h-touch min-w-touch',
  gesture: 'touch-manipulation select-none',
  focus: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
  active: 'active:scale-95 transition-transform',
} as const;

export const performanceClasses = {
  transform: 'will-change-transform',
  scroll: 'scrollbar-hide scroll-smooth',
  lazy: 'content-visibility-auto contain-intrinsic-size-auto',
} as const;

export const layoutPatterns = {
  adaptiveSidebar: {
    mobile: 'fixed bottom-0 left-0 right-0 h-auto max-h-[50dvh] rounded-t-2xl',
    tablet: 'fixed top-reader-header right-0 h-full w-reader-sidebar-right rounded-l-2xl',
    desktop: 'static h-full w-reader-sidebar-right rounded-xl',
  },
  adaptiveHeader: {
    mobile:
      'fixed top-0 left-0 right-0 min-h-[calc(var(--reader-header-height-compact)+var(--reader-safe-area-top))] pt-safe pl-safe pr-safe',
    tablet:
      'fixed top-0 left-0 right-0 min-h-[calc(var(--reader-header-height)+var(--reader-safe-area-top))] pt-safe pl-safe pr-safe',
    desktop: 'static h-20 px-6',
  },
  adaptiveContent: {
    mobile: 'pt-14 bottom-nav-space',
    tablet: 'pt-reader-header bottom-nav-space',
    desktop: 'p-0',
  },
  orientation: {
    portrait: 'portrait:flex-col',
    landscape: 'landscape:flex-row',
    portraitOnly: 'portrait:block landscape:hidden',
    landscapeOnly: 'landscape:block portrait:hidden',
  },
} as const;

interface ResponsiveState {
  breakpoint: BreakpointKey;
  orientation: OrientationKey;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  variant: ComponentVariant;
  focusManagement: ReturnType<typeof useResponsiveFocus>;
}

export const useResponsiveState = (enableFocusManagement = false): ResponsiveState => {
  const breakpoint = useBreakpoint();
  const orientation = useOrientation();

  const focusManagement = useResponsiveFocus(
    breakpoint === 'mobile' ? 'mobile' : breakpoint === 'tablet' ? 'tablet' : 'desktop',
    enableFocusManagement
  );

  return {
    breakpoint,
    orientation,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    variant: getVariantForBreakpoint(breakpoint),
    focusManagement,
  };
};
