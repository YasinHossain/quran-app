import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react';

export type QcfFontVersion = 'v1' | 'v2' | 'v4';

/**
 * Load King Fahad Complex (Madani V1/V2/V4 Tajweed) fonts per page using the FontFace API.
 * Returns a helper to resolve the family name for a page.
 */
interface UseQcfFontResult {
  getPageFontFamily: (pageNumber: number) => string;
  isPageFontLoaded: (pageNumber: number) => boolean;
}

export const useQcfMushafFont = (
  pageNumbers: number[],
  version: QcfFontVersion = 'v1'
): UseQcfFontResult => {
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const loadingRef = useRef<Record<string, boolean>>({});

  useQcfFontLoader({ pageNumbers, version, loadedMap, setLoadedMap, loadingRef });

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

const getFontFaceName = (pageNumber: number, version: QcfFontVersion): string =>
  `p${pageNumber}-${version}`;

const getFontKey = (pageNumber: number, version: QcfFontVersion): string =>
  `${version}-${pageNumber}`;

/**
 * Get the font source URL for a given page and version.
 * All versions use local paths. V4 fonts are proxied to qurancdn.com via Next.js rewrites.
 */
const getFontSource = (pageNumber: number, version: QcfFontVersion): string => {
  // All versions now use local paths - V4 is proxied via next.config.ts rewrites
  return `url('/fonts/quran/hafs/${version}/woff2/p${pageNumber}.woff2') format('woff2')`;
};

interface FontLoaderConfig {
  pageNumbers: number[];
  version: QcfFontVersion;
  loadedMap: Record<string, boolean>;
  setLoadedMap: Dispatch<SetStateAction<Record<string, boolean>>>;
  loadingRef: MutableRefObject<Record<string, boolean>>;
}

const useQcfFontLoader = ({
  pageNumbers,
  version,
  loadedMap,
  setLoadedMap,
  loadingRef,
}: FontLoaderConfig): void => {
  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;

    const uniquePages = Array.from(new Set(pageNumbers)).filter(
      (page) => Number.isFinite(page) && page > 0
    );

    uniquePages.forEach((pageNumber) => {
      const fontFaceName = getFontFaceName(pageNumber, version);
      const key = getFontKey(pageNumber, version);

      const isAlreadyLoaded = Array.from(document.fonts).some(
        (font) => font.family === fontFaceName && font.status === 'loaded'
      );

      if (isAlreadyLoaded) {
        setLoadedMap((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
        return;
      }

      if (loadedMap[key] || loadingRef.current[key]) return;
      loadingRef.current[key] = true;

      const loadFont = async (): Promise<void> => {
        try {
          if (typeof FontFace === 'undefined') {
            loadingRef.current[key] = false;
            return;
          }
          const src = getFontSource(pageNumber, version);
          const fontFace = new FontFace(fontFaceName, src);
          fontFace.display = 'block';
          const loadedFace = await fontFace.load();
          (document as Document & { fonts?: FontFaceSet }).fonts?.add(loadedFace);
          setLoadedMap((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
        } catch (error) {
          console.error(`Failed to load font ${fontFaceName}`, error);
          loadingRef.current[key] = false;
        }
      };

      void loadFont();
    });
  }, [pageNumbers, loadedMap, version, setLoadedMap, loadingRef]);
};
