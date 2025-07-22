import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

// Ensure fetch is available in the JSDOM environment
if (typeof globalThis.fetch === 'undefined') {
  if (typeof global.fetch === 'function') {
    globalThis.fetch = (...args) => global.fetch(...args);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fetch = require('node-fetch');
    globalThis.fetch = (...args) => fetch.default(...args);
  }
}