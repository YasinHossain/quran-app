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

  const pickBackgroundSource = (
    s: string | ResponsiveImageSources,
    bp: ReturnType<typeof useResponsiveState>['breakpoint']
  ): string => {
    if (typeof s === 'string') return s;
    switch (bp) {
      case 'mobile':
        return s.mobile || s.fallback;
      case 'tablet':
        return s.tablet || s.mobile || s.fallback;
      case 'desktop':
      case 'wide':
        return s.desktop || s.tablet || s.fallback;
      default:
        return s.fallback;
    }
  };

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
