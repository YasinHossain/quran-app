'use client';

import Image from 'next/image';
import React from 'react';

import { useResponsiveImage } from './useResponsiveImage';

import type { ResponsiveImageProps } from './types';

/**
 * ResponsiveImage component that optimizes images for different screen sizes
 * Supports multiple formats, responsive sources, and smart loading strategies
 */
export const ResponsiveImage = ({
  src,
  sizes,
  fallback,
  loadingStrategy = 'auto',
  alt,
  className,
  priority,
  ...props
}: ResponsiveImageProps): React.JSX.Element => {
  const {
    optimalSource,
    responsiveSizes,
    loading,
    priority: autoPriority,
    onError,
  } = useResponsiveImage({
    src,
    sizes,
    fallback,
    loadingStrategy,
  });

  return (
    <Image
      src={optimalSource}
      alt={alt}
      sizes={responsiveSizes}
      loading={loading}
      priority={priority || autoPriority}
      className={className}
      onError={onError}
      {...props}
    />
  );
};
