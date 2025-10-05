'use client';

import React from 'react';

import { useResponsiveState } from '@/lib/responsive';

interface ResponsiveImageSources {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallback: string;
}

interface ResponsiveBackgroundImageProps {
  src: string | ResponsiveImageSources;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

type Breakpoint = ReturnType<typeof useResponsiveState>['breakpoint'];

const isResponsiveSource = (s: string | ResponsiveImageSources): s is ResponsiveImageSources =>
  typeof s !== 'string';

const getPreferredSource = (
  source: ResponsiveImageSources,
  order: (keyof ResponsiveImageSources)[]
): string => {
  for (const key of order) {
    const value = source[key];
    if (value) return value;
  }
  return source.fallback;
};

const resolveSourceForBreakpoint = (source: ResponsiveImageSources, bp: Breakpoint): string => {
  switch (bp) {
    case 'mobile':
      return getPreferredSource(source, ['mobile']);
    case 'tablet':
      return getPreferredSource(source, ['tablet', 'mobile']);
    case 'desktop':
    case 'wide':
      return getPreferredSource(source, ['desktop', 'tablet']);
    default:
      return source.fallback;
  }
};

const pickBackgroundSource = (s: string | ResponsiveImageSources, bp: Breakpoint): string =>
  isResponsiveSource(s) ? resolveSourceForBreakpoint(s, bp) : s;

/**
 * Utility component for background images with responsive behavior
 */
export const ResponsiveBackgroundImage = ({
  src,
  children,
  className = '',
  overlay = false,
  overlayOpacity = 0.5,
}: ResponsiveBackgroundImageProps): React.JSX.Element => {
  const { breakpoint } = useResponsiveState();

  const backgroundImage = pickBackgroundSource(src, breakpoint);

  return (
    <div
      className={`relative bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-surface-overlay" style={{ opacity: overlayOpacity }} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
