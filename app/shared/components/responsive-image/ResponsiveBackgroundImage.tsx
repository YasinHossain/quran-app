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

  const getOptimalSource = (): string => {
    if (typeof src === 'string') {
      return src;
    }

    switch (breakpoint) {
      case 'mobile':
        return src.mobile || src.fallback;
      case 'tablet':
        return src.tablet || src.mobile || src.fallback;
      case 'desktop':
      case 'wide':
        return src.desktop || src.tablet || src.fallback;
      default:
        return src.fallback;
    }
  };

  const backgroundImage = getOptimalSource();

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
