'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useResponsiveState } from '@/lib/responsive';

interface ResponsiveImageProps extends Omit<ImageProps, 'src' | 'sizes'> {
  src: string | ResponsiveImageSources;
  sizes?: ResponsiveImageSizes;
  fallback?: string;
  loadingStrategy?: 'lazy' | 'eager' | 'auto';
  formats?: ('webp' | 'avif' | 'png' | 'jpg')[];
}

interface ResponsiveImageSources {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallback: string;
}

interface ResponsiveImageSizes {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default: string;
}

/**
 * ResponsiveImage component that optimizes images for different screen sizes
 * Supports multiple formats, responsive sources, and smart loading strategies
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  sizes,
  fallback,
  loadingStrategy = 'auto',
  // formats = ['webp', 'jpg'], // TODO: Implement format optimization
  alt,
  className,
  priority,
  ...props
}) => {
  const { variant, breakpoint } = useResponsiveState();

  // Determine the optimal image source based on current breakpoint
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

  // Generate responsive sizes string
  const getResponsiveSizes = (): string => {
    if (!sizes) {
      // Default responsive sizes based on breakpoints
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }

    if (typeof sizes === 'string') {
      return sizes;
    }

    // Build sizes from responsive config
    const sizeQueries = [];

    if (sizes.mobile) {
      sizeQueries.push(`(max-width: 767px) ${sizes.mobile}`);
    }

    if (sizes.tablet) {
      sizeQueries.push(`(max-width: 1023px) ${sizes.tablet}`);
    }

    if (sizes.desktop) {
      sizeQueries.push(`(min-width: 1024px) ${sizes.desktop}`);
    }

    // Add default as fallback
    sizeQueries.push(sizes.default);

    return sizeQueries.join(', ');
  };

  // Determine loading strategy
  const getLoadingStrategy = () => {
    if (loadingStrategy === 'auto') {
      // Eager load above-the-fold images on mobile, lazy load others
      return variant === 'compact' ? 'eager' : 'lazy';
    }
    return loadingStrategy;
  };

  const optimalSource = getOptimalSource();
  const responsiveSizes = getResponsiveSizes();
  const loading = getLoadingStrategy();

  return (
    <Image
      src={optimalSource}
      alt={alt}
      sizes={responsiveSizes}
      loading={loading}
      priority={priority || loading === 'eager'}
      className={className}
      onError={(e) => {
        // Fallback to provided fallback or a default placeholder
        if (fallback) {
          e.currentTarget.src = fallback;
        } else {
          // Generate a simple SVG placeholder
          const fallbackSvg = `data:image/svg+xml;base64,${btoa(
            `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui" font-size="14">
                Image
              </text>
            </svg>`
          )}`;
          e.currentTarget.src = fallbackSvg;
        }
      }}
      {...props}
    />
  );
};

/**
 * Utility component for background images with responsive behavior
 */
interface ResponsiveBackgroundImageProps {
  src: string | ResponsiveImageSources;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const ResponsiveBackgroundImage: React.FC<ResponsiveBackgroundImageProps> = ({
  src,
  children,
  className = '',
  overlay = false,
  overlayOpacity = 0.5,
}) => {
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
      {overlay && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * Utility for generating responsive image URLs (e.g., for different CDN sizes)
 */
export const generateResponsiveUrls = (
  baseUrl: string,
  options: {
    widths: number[];
    format?: string;
    quality?: number;
  }
): ResponsiveImageSources => {
  const { widths, format = 'webp', quality = 80 } = options;

  // This is a generic implementation - adjust based on your CDN/image service
  const generateUrl = (width: number) => {
    return `${baseUrl}?w=${width}&f=${format}&q=${quality}`;
  };

  return {
    mobile: generateUrl(widths[0] || 640),
    tablet: generateUrl(widths[1] || 1024),
    desktop: generateUrl(widths[2] || 1920),
    fallback: baseUrl,
  };
};

/**
 * Hook for responsive image preloading
 */
export const useImagePreload = (sources: string[], condition = true) => {
  React.useEffect(() => {
    if (!condition) return;

    const preloadedImages: HTMLImageElement[] = [];

    sources.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      preloadedImages.push(img);
    });

    return () => {
      // Cleanup if needed
      preloadedImages.forEach((img) => {
        img.src = '';
      });
    };
  }, [sources, condition]);
};

export default ResponsiveImage;
