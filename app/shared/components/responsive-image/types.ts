import type { ImageProps } from 'next/image';

export interface ResponsiveImageSources {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallback: string;
}

export interface ResponsiveImageSizes {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default: string;
}

export interface ResponsiveImageProps extends Omit<ImageProps, 'src' | 'sizes'> {
  src: string | ResponsiveImageSources;
  sizes?: ResponsiveImageSizes;
  fallback?: string;
  loadingStrategy?: 'lazy' | 'eager' | 'auto';
  formats?: ('webp' | 'avif' | 'png' | 'jpg')[];
}
