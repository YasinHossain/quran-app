/* eslint-disable @typescript-eslint/explicit-function-return-type */
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import { jest } from '@jest/globals';

// Ensure fetch is available in the JSDOM environment - cross-fetch/polyfill should handle this
if (typeof globalThis.fetch === 'undefined') {
  // Simple mock fetch for tests
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Minimal mock that satisfies Next's useIntersection requirements
class IntersectionObserverMock {
  /** @param {IntersectionObserverCallback} cb */
  constructor(cb) {
    this.cb = cb;
  }

  /** @type {(el: Element) => void} */
  observe = (el) => {
    if (this.cb) {
      this.cb([{ isIntersecting: true, target: el }]);
    }
  };

  /** @type {() => void} */
  unobserve = () => {};

  /** @type {() => void} */
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

jest.mock('@/lib/api/chapters', () => ({
  getChapters: jest.fn().mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
    { id: 2, name_simple: 'Al-Baqarah', verses_count: 286 },
  ]),
}));
