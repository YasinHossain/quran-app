import { useCallback, useEffect, useState } from 'react';

/**
 * Load Quran.com King Fahad Complex (Madani V1) fonts per page using the
 * FontFace API. Returns a helper to resolve the family name for a page.
 */
interface UseQcfFontResult {
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
}

export const useQcfMushafFont = (
  pageNumbers: number[],
  version: 'v1' | 'v2' = 'v1'
): UseQcfFontResult => {
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;

    const uniquePages = Array.from(new Set(pageNumbers)).filter(
      (page) => Number.isFinite(page) && page > 0
    );

    uniquePages.forEach((pageNumber) => {
      const fontFaceName = `p${pageNumber}-${version}`;
      const src = `url('/fonts/quran/hafs/${version}/woff2/p${pageNumber}.woff2') format('woff2')`;
      const key = `${version}-${pageNumber}`;

      // Skip if we've already marked this page as loaded.
      if (loadedMap[key]) return;

      const loadFont = async (): Promise<void> => {
        const fontFace = new FontFace(fontFaceName, src);
        fontFace.display = 'block';
        try {
          const loadedFace = await fontFace.load();
          (document as Document & { fonts?: FontFaceSet }).fonts?.add(loadedFace);
          setLoadedMap((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
        } catch {
          // Ignore failures for individual pages; caller can fall back.
        }
      };

      void loadFont();
    });
  }, [pageNumbers, loadedMap, version]);

  const getPageFontFamily = useCallback(
    (pageNumber: number): string => {
      return `p${pageNumber}-${version}`;
    },
    [version]
  );

  const isPageFontLoaded = useCallback(
    (pageNumber: number): boolean => Boolean(pageNumber && loadedMap[`${version}-${pageNumber}`]),
    [loadedMap, version]
  );

  return { getPageFontFamily, isPageFontLoaded };
};
