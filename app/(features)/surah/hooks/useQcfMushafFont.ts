import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react';

/**
 * Load King Fahad Complex (Madani V1) fonts per page using the FontFace API.
 * Returns a helper to resolve the family name for a page.
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

const getFontFaceName = (pageNumber: number, version: 'v1' | 'v2'): string =>
  `p${pageNumber}-${version}`;

const getFontKey = (pageNumber: number, version: 'v1' | 'v2'): string => `${version}-${pageNumber}`;

interface FontLoaderConfig {
  pageNumbers: number[];
  version: 'v1' | 'v2';
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
        const src = `url('/fonts/quran/hafs/${version}/woff2/p${pageNumber}.woff2') format('woff2')`;
        const fontFace = new FontFace(fontFaceName, src);
        fontFace.display = 'block';
        try {
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
