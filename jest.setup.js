/* eslint-disable @typescript-eslint/explicit-function-return-type */
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Provide Fetch/Response in JSDOM via whatwg-fetch so MSW interceptors work consistently
import 'whatwg-fetch';

import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';

import { server } from '@tests/setup/msw/server';
import { logger } from '@/src/infrastructure/monitoring/Logger';

// Provide Web Streams in Node test environment for MSW/@mswjs/interceptors
if (typeof globalThis.ReadableStream === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.ReadableStream = ReadableStream;
}
if (typeof globalThis.WritableStream === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.WritableStream = WritableStream;
}
if (typeof globalThis.TransformStream === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.TransformStream = TransformStream;
}
// Provide BroadcastChannel stub required by MSW in Node
if (typeof globalThis.BroadcastChannel === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.BroadcastChannel = class {
    constructor() {}

    postMessage() {}

    close() {}

    addEventListener() {}

    removeEventListener() {}
    onmessage = null;
  };
}

// Start MSW for tests unless explicitly disabled
// Set JEST_ALLOW_NETWORK=1 to bypass MSW and allow real network requests
if (!process.env.JEST_ALLOW_NETWORK) {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

// Ensure fetch is available in the JSDOM environment - cross-fetch/polyfill should handle this
// MSW will intercept fetch calls, so we only need a fallback if MSW doesn't handle a request
// Note: MSW intercepts fetch. If fetch is missing for any reason, provide a minimal fallback.
if (typeof globalThis.fetch === 'undefined') {
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

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
}
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// matchMedia is provided by tests/setup/matchMedia.ts (setupFiles)
// Intentionally avoid redefining it here with a jest.fn to prevent resetMocks
// from clearing its implementation between tests.

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

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'ResizeObserver', {
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

  // HTMLMediaElement stubs - comprehensive audio player test support
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  HTMLMediaElement.prototype.load = jest.fn();
  HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'probably');

  // Audio player state properties
  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
    get() {
      return this._currentTime || 0;
    },
    set(value) {
      this._currentTime = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
    get() {
      return this._duration || 0;
    },
    set(value) {
      this._duration = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
    get() {
      return this._volume !== undefined ? this._volume : 1;
    },
    set(value) {
      this._volume = Math.max(0, Math.min(1, value));
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    get() {
      return this._playbackRate || 1;
    },
    set(value) {
      this._playbackRate = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    get() {
      return this._paused !== undefined ? this._paused : true;
    },
    set(value) {
      this._paused = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'ended', {
    get() {
      return this._ended || false;
    },
    set(value) {
      this._ended = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
    get() {
      return this._readyState || 4;
    }, // HAVE_ENOUGH_DATA
    set(value) {
      this._readyState = value;
    },
    configurable: true,
  });

  // Audio loading states
  Object.defineProperty(HTMLMediaElement.prototype, 'networkState', {
    get() {
      return this._networkState || 1;
    }, // NETWORK_IDLE
    set(value) {
      this._networkState = value;
    },
    configurable: true,
  });

  // Event simulation helpers for tests
  HTMLMediaElement.prototype.simulateEvent = function (eventType) {
    const event = new Event(eventType);
    this.dispatchEvent(event);
  };

  HTMLMediaElement.prototype.simulateTimeUpdate = function (time) {
    this._currentTime = time;
    this.simulateEvent('timeupdate');
  };

  HTMLMediaElement.prototype.simulateLoadedData = function (duration = 60) {
    this._duration = duration;
    this._readyState = 4;
    this.simulateEvent('loadeddata');
    this.simulateEvent('canplay');
    this.simulateEvent('canplaythrough');
  };

  HTMLMediaElement.prototype.simulatePlay = function () {
    this._paused = false;
    this.simulateEvent('play');
    this.simulateEvent('playing');
  };

  HTMLMediaElement.prototype.simulatePause = function () {
    this._paused = true;
    this.simulateEvent('pause');
  };

  HTMLMediaElement.prototype.simulateEnd = function () {
    this._ended = true;
    this._paused = true;
    this.simulateEvent('ended');
  };
}

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// Make logger.error spy-able so tests can call mockRestore()
// Do not override implementation; just wrap with a spy.
jest.spyOn(logger, 'error');
