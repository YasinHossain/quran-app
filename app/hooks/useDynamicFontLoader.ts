'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Font metadata for dynamic loading
 * Key: The font-family value used in CSS (e.g., "Amiri", serif)
 * Value: Array of font file sources to load
 */
const FONT_SOURCES: Record<string, { src: string; weight: number | string; style?: string }[]> = {
  // Arabic Script Fonts (lazy loaded)
  '"KFGQPC-Uthman-Taha", serif': [
    { src: '/fonts/KFGQPC-Uthman-Taha.ttf', weight: 'normal' },
    { src: '/fonts/KFGQPC-Uthman-Taha-Bold.ttf', weight: 'bold' },
  ],
  '"KFGQ V2", serif': [
    { src: '/fonts/KFGQPC-Uthman-Taha.ttf', weight: 'normal' },
    { src: '/fonts/KFGQPC-Uthman-Taha-Bold.ttf', weight: 'bold' },
  ],

  '"Amiri Quran", serif': [{ src: '/fonts/AmiriQuran.ttf', weight: 'normal' }],
  '"Scheherazade New", serif': [{ src: '/fonts/Scheherazade-New.ttf', weight: 'normal' }],
  '"Noto Naskh Arabic", serif': [{ src: '/fonts/Noto-Naskh-Arabic.ttf', weight: 'normal' }],

  '"Me Quran", serif': [{ src: '/fonts/me_quran.ttf', weight: 'normal' }],
  '"IndoPak", serif': [
    {
      src: '/fonts/quran/hafs/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2',
      weight: 'normal',
    },
  ],
  '"Noor-e-Huda", serif': [{ src: '/fonts/Noor-e-Huda.ttf', weight: 'normal' }],
  '"Noor-e-Hidayat", serif': [{ src: '/fonts/Noor-e-Hidayat.ttf', weight: 'normal' }],
  '"Noor-e-Hira", serif': [{ src: '/fonts/Noor-e-Hira.ttf', weight: 'normal' }],
  '"Lateef", serif': [{ src: '/fonts/Lateef.ttf', weight: 'normal' }],
  // UthmanicHafs is preloaded - no need to lazy load
};

// Track which fonts have been loaded to avoid duplicate loading
const loadedFonts = new Set<string>();

// Track fonts currently being loaded
const loadingFonts = new Map<string, Promise<void>>();

/**
 * Get the font family name from a CSS font-family value
 * e.g., '"Amiri", serif' -> 'Amiri'
 */
function extractFontFamilyName(fontValue: string): string {
  const match = fontValue.match(/"([^"]+)"/);
  if (match && match[1]) {
    return match[1];
  }
  return fontValue.split(',')[0]?.trim() || fontValue;
}

/**
 * Load a single font file using the FontFace API
 */
async function loadFontFile(
  familyName: string,
  src: string,
  weight: number | string,
  style: string = 'normal'
): Promise<void> {
  const fontFace = new FontFace(familyName, `url("${src}")`, {
    weight: String(weight),
    style,
    display: 'swap',
  });

  try {
    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);
  } catch (error) {
    console.warn(`Failed to load font ${familyName} from ${src}:`, error);
  }
}

/**
 * Load all font files for a given font family value
 */
async function loadFont(fontFamilyValue: string): Promise<void> {
  // Skip if already loaded
  if (loadedFonts.has(fontFamilyValue)) {
    return;
  }

  // Skip if currently loading (avoid duplicate requests)
  if (loadingFonts.has(fontFamilyValue)) {
    return loadingFonts.get(fontFamilyValue);
  }

  // Get font sources
  const sources = FONT_SOURCES[fontFamilyValue];
  if (!sources) {
    // Font might be the default (UthmanicHafs) or a browser font
    return;
  }

  const familyName = extractFontFamilyName(fontFamilyValue);

  // Create loading promise
  const loadPromise = (async () => {
    try {
      // Load all weights/styles for this font
      await Promise.all(
        sources.map((source) => loadFontFile(familyName, source.src, source.weight, source.style))
      );
      loadedFonts.add(fontFamilyValue);
    } finally {
      loadingFonts.delete(fontFamilyValue);
    }
  })();

  loadingFonts.set(fontFamilyValue, loadPromise);
  return loadPromise;
}

/**
 * Hook to dynamically load fonts when needed
 *
 * @param fontFamilyValue - The CSS font-family value (e.g., '"Amiri", serif')
 *
 * @example
 * ```tsx
 * const { settings } = useSettings();
 * useDynamicFontLoader(settings.arabicFontFace);
 * ```
 */
export function useDynamicFontLoader(fontFamilyValue: string | undefined): void {
  const previousFont = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!fontFamilyValue) return;

    // Skip if font hasn't changed
    if (previousFont.current === fontFamilyValue) return;
    previousFont.current = fontFamilyValue;

    // Default font is preloaded, skip
    if (fontFamilyValue.includes('UthmanicHafs1Ver18')) return;

    // Load the font dynamically
    loadFont(fontFamilyValue);
  }, [fontFamilyValue]);
}

/**
 * Preload a font before it's needed (e.g., when user hovers over font option)
 */
export function preloadFont(fontFamilyValue: string): void {
  if (fontFamilyValue.includes('UthmanicHafs1Ver18')) return;
  loadFont(fontFamilyValue);
}

/**
 * Hook that provides a preload callback for font options
 * Useful for preloading fonts on hover in font selectors
 */
export function useFontPreloader(): (fontFamilyValue: string) => void {
  return useCallback((fontFamilyValue: string) => {
    preloadFont(fontFamilyValue);
  }, []);
}

/**
 * Check if a font is already loaded
 */
export function isFontLoaded(fontFamilyValue: string): boolean {
  if (fontFamilyValue.includes('UthmanicHafs1Ver18')) return true;
  return loadedFonts.has(fontFamilyValue);
}
