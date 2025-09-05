/**
 * Unified Responsive Design System
 *
 * This module provides utilities for creating truly responsive components
 * that adapt naturally across all screen sizes without duplication.
 */

import React from 'react';

import { useResponsiveFocus } from './focus';

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'wide';
export type OrientationKey = 'portrait' | 'landscape';

export interface ResponsiveConfig<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

export interface OrientationConfig<T> {
  portrait?: T;
  landscape?: T;
}

/**
 * Container query breakpoints for intrinsic responsiveness
 */
export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerConfig<T> {
  xs?: T; // < 384px
  sm?: T; // >= 384px
  md?: T; // >= 768px
  lg?: T; // >= 1024px
  xl?: T; // >= 1280px
}

/**
 * Responsive breakpoint hook
 * Determines the current breakpoint using matchMedia listeners.
 */
export const useBreakpoint = (): BreakpointKey => {
  const getBreakpoint = (): BreakpointKey => {
    if (typeof window === 'undefined') return 'mobile';
    if (window.matchMedia('(min-width: 1280px)').matches) return 'wide';
    if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
    if (window.matchMedia('(min-width: 768px)').matches) return 'tablet';
    return 'mobile';
  };

  const [breakpoint, setBreakpoint] = React.useState<BreakpointKey>('mobile');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setBreakpoint(getBreakpoint());

    const updateBreakpoint = () => setBreakpoint(getBreakpoint());

    const queries = [
      window.matchMedia('(min-width: 768px)'),
      window.matchMedia('(min-width: 1024px)'),
      window.matchMedia('(min-width: 1280px)'),
    ];

    queries.forEach((q) => q.addEventListener('change', updateBreakpoint));

    return () => {
      queries.forEach((q) => q.removeEventListener('change', updateBreakpoint));
    };
  }, []);

  // Return mobile breakpoint during SSR to prevent hydration mismatches
  return isClient ? breakpoint : 'mobile';
};

/**
 * Orientation detection hook
 * Determines current screen orientation using matchMedia listeners
 */
export const useOrientation = (): OrientationKey => {
  const getOrientation = (): OrientationKey => {
    if (typeof window === 'undefined') return 'portrait';
    return window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
  };

  const [orientation, setOrientation] = React.useState<OrientationKey>('portrait');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setOrientation(getOrientation());

    const updateOrientation = () => setOrientation(getOrientation());

    const orientationQuery = window.matchMedia('(orientation: landscape)');
    orientationQuery.addEventListener('change', updateOrientation);

    return () => {
      orientationQuery.removeEventListener('change', updateOrientation);
    };
  }, []);

  // Return portrait during SSR to prevent hydration mismatches
  return isClient ? orientation : 'portrait';
};

/**
 * Get responsive value based on current breakpoint
 *
 * @example
 * const columns = getResponsiveValue({
 *   mobile: 1,
 *   tablet: 2,
 *   desktop: 3
 * });
 */
export const getResponsiveValue = <T>(
  breakpoint: BreakpointKey,
  config: ResponsiveConfig<T>
): T => {
  // Use mobile-first fallback
  return config[breakpoint] ?? config.tablet ?? config.mobile;
};

export const useResponsiveValue = <T>(config: ResponsiveConfig<T>): T => {
  const breakpoint = useBreakpoint();
  return getResponsiveValue<T>(breakpoint, config);
};

/**
 * Unified component variant system
 * Instead of separate mobile/desktop components, use variants
 */
export type ComponentVariant = 'compact' | 'default' | 'expanded';

export const getVariantForBreakpoint = (breakpoint: BreakpointKey): ComponentVariant => {
  switch (breakpoint) {
    case 'mobile':
      return 'compact';
    case 'tablet':
      return 'default';
    case 'desktop':
    case 'wide':
      return 'expanded';
    default:
      return 'default';
  }
};

/**
 * CSS class builders for consistent responsive patterns
 */
export const responsiveClasses = {
  // Container patterns
  container: 'w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl',

  // Layout patterns - mobile first, scale up
  stack: 'flex flex-col gap-3 sm:gap-4 lg:gap-6',
  row: 'flex flex-col gap-3 sm:flex-row sm:gap-4 lg:gap-6',
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

  // Text patterns - readable at all sizes
  heading: 'text-lg font-semibold sm:text-xl lg:text-2xl',
  body: 'text-sm sm:text-base lg:text-lg leading-relaxed',
  caption: 'text-xs sm:text-sm text-muted',
  timeLabel: 'text-[10px] md:text-[11px] tabular-nums text-muted', // Timeline time labels

  // Interactive patterns - touch friendly
  button: 'min-h-touch px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3',
  input: 'min-h-touch px-3 py-2 sm:px-4 sm:py-2.5',

  // Spacing patterns - consistent across sizes
  padding: 'p-3 sm:p-4 lg:p-6 xl:p-8',
  margin: 'm-3 sm:m-4 lg:m-6 xl:m-8',
  gap: 'gap-3 sm:gap-4 lg:gap-6 xl:gap-8',

  // Width patterns - responsive and semantic
  timeDisplay: 'min-w-[72px] md:min-w-[88px]', // Time display minimum widths

  // Navigation patterns - unified approach
  nav: 'flex items-center justify-between p-3 sm:p-4 lg:p-6',
  sidebar: 'w-full sm:w-80 lg:w-80 transition-transform duration-300',
};

/**
 * Icon size utilities - responsive and consistent
 */
export const iconClasses = {
  xs: 'h-3 w-3 sm:h-3.5 sm:w-3.5', // 12-14px
  sm: 'h-4 w-4 sm:h-4 sm:w-4', // 16px
  md: 'h-5 w-5 sm:h-5 sm:w-5', // 20px
  lg: 'h-6 w-6 sm:h-6 sm:w-6', // 24px
  xl: 'h-8 w-8 sm:h-8 sm:w-8', // 32px
  // Touch-friendly icon buttons
  touch: 'h-[18px] w-[18px] sm:h-5 sm:w-5', // Default interactive icon size
  stroke: 'stroke-[1.5] sm:stroke-[1.75]', // Responsive stroke width
};

/**
 * Touch and interaction utilities
 */
export const touchClasses = {
  target: 'min-h-touch min-w-touch', // WCAG compliant
  gesture: 'touch-manipulation select-none',
  focus: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
  active: 'active:scale-95 transition-transform',
};

/**
 * Performance optimization utilities
 */
export const performanceClasses = {
  transform: 'will-change-transform',
  scroll: 'scrollbar-hide scroll-smooth',
  lazy: 'content-visibility-auto contain-intrinsic-size-auto',
};

/**
 * Responsive component factory
 * Creates truly adaptive components instead of breakpoint-specific ones
 */
export const createResponsiveComponent = <P extends object>(
  baseComponent: React.ComponentType<P>,
  adaptations: {
    [K in ComponentVariant]?: Partial<P>;
  }
) => {
  const ResponsiveComponent = (props: P) => {
    const breakpoint = useBreakpoint();
    const variant = getVariantForBreakpoint(breakpoint);
    const adaptedProps = { ...props, ...adaptations[variant] };

    return React.createElement(baseComponent, adaptedProps);
  };
  ResponsiveComponent.displayName = `Responsive(${baseComponent.displayName || baseComponent.name || 'Component'})`;
  return ResponsiveComponent;
};

/**
 * Layout composition utilities
 * Build layouts that adapt naturally without media queries
 */
export const layoutPatterns = {
  // Sidebar that becomes bottom sheet on mobile
  adaptiveSidebar: {
    mobile: 'fixed bottom-0 left-0 right-0 h-auto max-h-[50dvh] rounded-t-2xl',
    tablet: 'fixed top-0 right-0 h-full w-80 rounded-l-2xl',
    desktop: 'static h-full w-80 rounded-xl',
  },

  // Header that adapts without breaking
  adaptiveHeader: {
    mobile:
      'fixed top-0 left-0 right-0 min-h-[calc(3.5rem+env(safe-area-inset-top))] pt-safe pl-safe pr-safe',
    tablet:
      'fixed top-0 left-0 right-0 min-h-[calc(4rem+env(safe-area-inset-top))] pt-safe pl-safe pr-safe',
    desktop: 'static h-20 px-6',
  },

  // Content area that works with any navigation
  adaptiveContent: {
    mobile: 'pt-14 bottom-nav-space', // Account for fixed header/nav and safe areas
    tablet: 'pt-16 bottom-nav-space',
    desktop: 'p-0', // No fixed elements
  },

  // Orientation-specific classes
  orientation: {
    portrait: 'portrait:flex-col',
    landscape: 'landscape:flex-row',
    portraitOnly: 'portrait:block landscape:hidden',
    landscapeOnly: 'landscape:block portrait:hidden',
  },
};

/**
 * Get orientation-aware responsive value
 */
export const getOrientationValue = <T>(
  config: OrientationConfig<T>,
  fallback: T,
  orientation: OrientationKey
): T => {
  if (orientation === 'landscape' && config.landscape !== undefined) {
    return config.landscape;
  }
  if (orientation === 'portrait' && config.portrait !== undefined) {
    return config.portrait;
  }
  return fallback;
};

/**
 * State management for responsive behavior with focus management
 */
export const useResponsiveState = (enableFocusManagement = false) => {
  const breakpoint = useBreakpoint();
  const orientation = useOrientation();

  // Optional focus management for responsive layout changes
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

/**
 * Container Query Utilities
 * Enable components to respond to their container size rather than viewport
 */

/**
 * Container query classes for Tailwind CSS
 * Usage: Apply @container to parent, then use @[384px]:text-lg on children
 */
export const containerClasses = {
  // Container types
  container: '@container',
  containerInline: '@container/inline',
  containerSize: '@container/size',

  // Container size utilities (use with container)
  xs: '@xs', // < 384px
  sm: '@sm', // >= 384px
  md: '@md', // >= 768px
  lg: '@lg', // >= 1024px
  xl: '@xl', // >= 1280px

  // Direct size-based queries
  '320px': '@[320px]',
  '384px': '@[384px]',
  '640px': '@[640px]',
  '768px': '@[768px]',
  '1024px': '@[1024px]',
  '1280px': '@[1280px]',
} as const;

/**
 * Get container-aware responsive value
 * Similar to getResponsiveValue but uses container size context
 */
export const getContainerValue = <T>(config: ContainerConfig<T>, fallback: T): T => {
  // This would need runtime container size detection
  // For now, return fallback (can be enhanced with IntersectionObserver)
  return fallback;
};

/**
 * Hook for container-aware responsive behavior
 */
export const useContainer = (containerRef?: React.RefObject<HTMLElement>) => {
  const [containerSize, setContainerSize] = React.useState<ContainerSize>('sm');

  React.useEffect(() => {
    if (!containerRef?.current) return;

    const updateContainerSize = () => {
      if (!containerRef.current) return;

      const { width } = containerRef.current.getBoundingClientRect();

      if (width >= 1280) setContainerSize('xl');
      else if (width >= 1024) setContainerSize('lg');
      else if (width >= 768) setContainerSize('md');
      else if (width >= 384) setContainerSize('sm');
      else setContainerSize('xs');
    };

    // Initial measurement
    updateContainerSize();

    // Use ResizeObserver for efficient container size tracking
    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return {
    containerSize,
    isXs: containerSize === 'xs',
    isSm: containerSize === 'sm',
    isMd: containerSize === 'md',
    isLg: containerSize === 'lg',
    isXl: containerSize === 'xl',
    isSmUp: ['sm', 'md', 'lg', 'xl'].includes(containerSize),
    isMdUp: ['md', 'lg', 'xl'].includes(containerSize),
    isLgUp: ['lg', 'xl'].includes(containerSize),
  };
};

/**
 * Utility to get container classes for responsive components
 */
export const getContainerClasses = (containerName?: string): string => {
  return containerName ? `@container/${containerName}` : '@container';
};
