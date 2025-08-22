/**
 * Unified Responsive Design System
 *
 * This module provides utilities for creating truly responsive components
 * that adapt naturally across all screen sizes without duplication.
 */

import React from 'react';

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface ResponsiveConfig<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

/**
 * Responsive breakpoint hook
 * Determines the current breakpoint using matchMedia listeners.
 */
export const useBreakpoint = (): BreakpointKey => {
  const getBreakpoint = (): BreakpointKey => {
    if (window.matchMedia('(min-width: 1280px)').matches) return 'wide';
    if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
    if (window.matchMedia('(min-width: 768px)').matches) return 'tablet';
    return 'mobile';
  };

  const [breakpoint, setBreakpoint] = React.useState<BreakpointKey>(() =>
    typeof window !== 'undefined' ? getBreakpoint() : 'mobile'
  );

  React.useEffect(() => {
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

  return breakpoint;
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

  // Interactive patterns - touch friendly
  button: 'min-h-touch px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3',
  input: 'min-h-touch px-3 py-2 sm:px-4 sm:py-2.5',

  // Spacing patterns - consistent across sizes
  padding: 'p-3 sm:p-4 lg:p-6 xl:p-8',
  margin: 'm-3 sm:m-4 lg:m-6 xl:m-8',
  gap: 'gap-3 sm:gap-4 lg:gap-6 xl:gap-8',

  // Navigation patterns - unified approach
  nav: 'flex items-center justify-between p-3 sm:p-4 lg:p-6',
  sidebar: 'w-full max-w-80 sm:max-w-sm lg:max-w-md transition-transform duration-300',
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
    mobile: 'fixed top-0 left-0 right-0 h-14 px-3',
    tablet: 'fixed top-0 left-0 right-0 h-16 px-4',
    desktop: 'static h-20 px-6',
  },

  // Content area that works with any navigation
  adaptiveContent: {
    mobile: 'pt-14 bottom-nav-space', // Account for fixed header/nav and safe areas
    tablet: 'pt-16 pb-4',
    desktop: 'p-0', // No fixed elements
  },
};

/**
 * State management for responsive behavior
 */
export const useResponsiveState = () => {
  const breakpoint = useBreakpoint();

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    variant: getVariantForBreakpoint(breakpoint),
  };
};
