import React from 'react';

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

