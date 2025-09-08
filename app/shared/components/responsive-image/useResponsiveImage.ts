import { useResponsiveState } from '@/lib/responsive';

import { buildFallbackSvg, buildSizes, pickImageSource } from './imageUtils';

import type { ResponsiveImageProps } from './types';

export const useResponsiveImage = ({
  src,
  sizes,
  fallback,
  loadingStrategy = 'auto',
}: Pick<ResponsiveImageProps, 'src' | 'sizes' | 'fallback' | 'loadingStrategy'>) => {
  const { variant, breakpoint } = useResponsiveState();

  const resolveLoading = (
    strategy: ResponsiveImageProps['loadingStrategy'],
    v: ReturnType<typeof useResponsiveState>['variant']
  ) => {
    if (strategy === 'auto') return v === 'compact' ? 'eager' : 'lazy';
    return strategy;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
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
