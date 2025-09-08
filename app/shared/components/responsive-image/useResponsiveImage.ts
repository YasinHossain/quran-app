import { useResponsiveState } from '@/lib/responsive';

import { buildFallbackSvg, buildSizes, pickImageSource } from './imageUtils';

import type { ResponsiveImageProps } from './types';

interface UseResponsiveImageResult {
  optimalSource: string;
  responsiveSizes: string;
  loading: 'lazy' | 'eager';
  priority: boolean;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const useResponsiveImage = ({
  src,
  sizes,
  fallback,
  loadingStrategy = 'auto',
}: Pick<
  ResponsiveImageProps,
  'src' | 'sizes' | 'fallback' | 'loadingStrategy'
>): UseResponsiveImageResult => {
  const { variant, breakpoint } = useResponsiveState();

  const resolveLoading = (
    strategy: ResponsiveImageProps['loadingStrategy'],
    v: ReturnType<typeof useResponsiveState>['variant']
  ): 'lazy' | 'eager' => {
    if (strategy === 'auto') return v === 'compact' ? 'eager' : 'lazy';
    return strategy;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    if (fallback) {
      e.currentTarget.src = fallback;
    } else {
      e.currentTarget.src = buildFallbackSvg();
    }
  };

  const optimalSource = pickImageSource(src, breakpoint);
  const responsiveSizes = buildSizes(sizes);
  const loading = resolveLoading(loadingStrategy, variant);

  return {
    optimalSource,
    responsiveSizes,
    loading,
    priority: loading === 'eager',
    onError: handleImageError,
  };
};
