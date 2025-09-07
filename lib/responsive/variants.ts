import React from 'react';

import { useBreakpoint, type BreakpointKey } from './breakpoints';

export interface ResponsiveConfig<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

export const getResponsiveValue = <T>(
  breakpoint: BreakpointKey,
  config: ResponsiveConfig<T>
): T => {
  return config[breakpoint] ?? config.tablet ?? config.mobile;
};

export const useResponsiveValue = <T>(config: ResponsiveConfig<T>): T => {
  const breakpoint = useBreakpoint();
  return getResponsiveValue<T>(breakpoint, config);
};

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

export const createResponsiveComponent = <P extends object>(
  baseComponent: React.ComponentType<P>,
  adaptations: { [K in ComponentVariant]?: Partial<P> }
): React.ComponentType<P> => {
  const ResponsiveComponent = (props: P) => {
    const breakpoint = useBreakpoint();
    const variant = getVariantForBreakpoint(breakpoint);
    const adaptedProps = { ...props, ...adaptations[variant] };

    return React.createElement(baseComponent, adaptedProps);
  };
  ResponsiveComponent.displayName = `Responsive(${baseComponent.displayName || baseComponent.name || 'Component'})`;
  return ResponsiveComponent;
};
