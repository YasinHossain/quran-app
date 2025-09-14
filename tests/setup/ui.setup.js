/* eslint-disable @typescript-eslint/explicit-function-return-type */
// UI test setup for React components and hooks
// JSDOM environment - includes DOM API polyfills

require('@testing-library/jest-dom');
require('cross-fetch/polyfill');

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

// ResizeObserver stub - minimal implementation to prevent JSDOM errors
class ResizeObserverMock {
  /** @param {ResizeObserverCallback} cb */
  constructor(cb) {
    this.cb = cb;
  }

  /** @type {(el: Element) => void} */
  observe = () => {};

  /** @type {() => void} */
  unobserve = () => {};

  /** @type {() => void} */
  disconnect = () => {};
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// navigator.clipboard stub - returns resolved Promise to prevent test failures
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  configurable: true,
  value: {
    writeText: () => Promise.resolve(),
  },
});

// HTMLMediaElement stubs - prevent JSDOM media errors
HTMLMediaElement.prototype.play = () => Promise.resolve();
HTMLMediaElement.prototype.pause = () => {};

// Individual tests will set up logger spies as needed using moduleNameMapper
