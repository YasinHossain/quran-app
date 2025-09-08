import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import { jest } from '@jest/globals';
import nodeFetch from 'node-fetch';

// Ensure fetch is available in the JSDOM environment
if (typeof globalThis.fetch === 'undefined') {
  if (typeof global.fetch === 'function') {
    globalThis.fetch = /** @type {typeof fetch} */ ((...args) => global.fetch(...args));
  } else {
    globalThis.fetch = /** @type {typeof fetch} */ ((...args) => nodeFetch(...args));
  }
}

// Minimal mock that satisfies Next's useIntersection requirements
class IntersectionObserverMock {
  /** @param {IntersectionObserverCallback} cb */
  constructor(cb) {
    this.cb = cb;
  }
  /** @param {Element} el @returns {void} */
  observe = (el) => {
    if (this.cb) {
      this.cb([{ isIntersecting: true, target: el }]);
    }
  };
  /** @returns {void} */
  unobserve = () => {};
  /** @returns {void} */
  disconnect = () => {};
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

jest.mock('@/app/shared/components/adaptive-navigation', () => () => null);
jest.mock('@/lib/api/chapters', () => ({
  getChapters: jest.fn().mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
    { id: 2, name_simple: 'Al-Baqarah', verses_count: 286 },
  ]),
}));
