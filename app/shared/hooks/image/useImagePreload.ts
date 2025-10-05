import React from 'react';

/**
 * Hook for responsive image preloading
 */
export const useImagePreload = (sources: string[], condition = true): void => {
  React.useEffect(() => {
    if (!condition) return;

    const preloadedImages: HTMLImageElement[] = [];

    sources.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      preloadedImages.push(img);
    });

    return (): void => {
      // Cleanup if needed
      preloadedImages.forEach((img) => {
        img.src = '';
      });
    };
  }, [sources, condition]);
};
