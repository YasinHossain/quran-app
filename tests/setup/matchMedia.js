// Ensure a fast, stable matchMedia exists before any test files import code.
// Loaded via Jest "setupFiles" so it runs before the test framework and imports.

// TextEncoder/TextDecoder polyfills for MSW in JSDOM
const { TextEncoder, TextDecoder } = require('util');
Object.assign(global, { TextDecoder, TextEncoder });

// Use function form so tests can override per-spec if needed without leaks.
const createMatchMedia =
  (matches = false) =>
  (query) => {
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated but often referenced by libs
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
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
  global.matchMedia = window.matchMedia;
}
