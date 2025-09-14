// Ensure a fast, stable matchMedia exists before any test files import code.
// Loaded via Jest "setupFiles" so it runs before the test framework and imports.

// TextEncoder/TextDecoder polyfills for MSW in JSDOM
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

// Use function form so tests can override per-spec if needed without leaks.
const createMatchMedia =
  (matches = false) =>
  (query: string) => {
    return {
      matches,
      media: query,
      onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null,
      addListener: () => {}, // deprecated but often referenced by libs
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  };

// Only polyfill if running in JSDOM environment (where window exists)
// Unit tests in Node.js environment don't need DOM APIs
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: createMatchMedia(false),
  });

  // Also mirror on global for any code referencing global.matchMedia directly.
  // Note: in JSDOM, window === globalThis, but we make it explicit.
  // @ts-expect-error - Node typings don't include matchMedia on global
  global.matchMedia = window.matchMedia;
}
