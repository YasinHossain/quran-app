import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Provide Fetch/Response in JSDOM via whatwg-fetch so MSW interceptors work consistently
import 'whatwg-fetch';

// Using inline polyfills (new version)

import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { server } from '@tests/setup/msw/server';

declare global {
  interface HTMLMediaElement {
    simulateEvent(eventType: string): void;
    simulateTimeUpdate(time: number): void;
    simulateLoadedData(duration?: number): void;
    simulatePlay(): void;
    simulatePause(): void;
    simulateEnd(): void;
  }
}

// Web Streams and BroadcastChannel polyfills
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
if (typeof globalThis.BroadcastChannel === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.BroadcastChannel = class {
    constructor() {}
    postMessage(): void {}
    close(): void {}
    addEventListener(): void {}
    removeEventListener(): void {}
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => void) | null = null;
  };
}

// TextEncoder/TextDecoder for MSW in JSDOM
// Node 20 provides these globally, but ensure they exist on `global`.
// @ts-expect-error - define if missing
Object.assign(global, { TextDecoder, TextEncoder });

// Start MSW for tests unless explicitly disabled.
// Set JEST_ALLOW_NETWORK=1 to bypass MSW and allow real network requests.
// Tests needing custom network responses should use `server.use` to add handlers.
if (!process.env.JEST_ALLOW_NETWORK) {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

// matchMedia polyfill
const createMatchMedia =
  (matches = false): ((query: string) => MediaQueryList) =>
  (query: string): MediaQueryList => {
    return {
      matches,
      media: query,
      onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null,
      addListener: (): void => {}, // deprecated but often referenced by libs
      removeListener: (): void => {},
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
      dispatchEvent: (): boolean => false,
    } as unknown as MediaQueryList;
  };

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: createMatchMedia(false),
  });
  // @ts-expect-error - Node typings don't include matchMedia on global
  global.matchMedia = window.matchMedia;
}

// IntersectionObserver mock
class IntersectionObserverMock {
  constructor(private cb: IntersectionObserverCallback) {}
  observe = (el: Element): void => {
    if (this.cb) {
      this.cb([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], this);
    }
  };
  unobserve = (): void => {};
  disconnect = (): void => {};
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

// ResizeObserver mock
class ResizeObserverMock {
  constructor(cb: ResizeObserverCallback) {
    void cb;
  }
  observe = (): void => {};
  unobserve = (): void => {};
  disconnect = (): void => {};
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });
  Object.defineProperty(navigator, 'clipboard', {
    writable: true,
    configurable: true,
    value: {
      writeText: () => Promise.resolve(),
    },
  });
}
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// HTMLMediaElement stubs
if (typeof window !== 'undefined') {
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  HTMLMediaElement.prototype.load = jest.fn();
  HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'probably');

  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
    get() {
      // @ts-expect-error - test shim
      return this._currentTime || 0;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._currentTime = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
    get() {
      // @ts-expect-error - test shim
      return this._duration || 0;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._duration = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
    get() {
      // @ts-expect-error - test shim
      return this._volume !== undefined ? this._volume : 1;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._volume = Math.max(0, Math.min(1, value));
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    get() {
      // @ts-expect-error - test shim
      return this._playbackRate || 1;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._playbackRate = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    get() {
      // @ts-expect-error - test shim
      return this._paused !== undefined ? this._paused : true;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._paused = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'ended', {
    get() {
      // @ts-expect-error - test shim
      return this._ended || false;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._ended = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
    get() {
      // @ts-expect-error - test shim
      return this._readyState || 4;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._readyState = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'networkState', {
    get() {
      // @ts-expect-error - test shim
      return this._networkState || 1;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._networkState = value;
    },
    configurable: true,
  });

  HTMLMediaElement.prototype.simulateEvent = function (eventType: string): void {
    const event = new Event(eventType);
    this.dispatchEvent(event);
  };

  HTMLMediaElement.prototype.simulateTimeUpdate = function (time: number): void {
    // @ts-expect-error - test shim
    this._currentTime = time;
    // @ts-expect-error - test shim
    this.simulateEvent('timeupdate');
  };

  HTMLMediaElement.prototype.simulateLoadedData = function (duration = 60): void {
    // @ts-expect-error - test shim
    this._duration = duration;
    // @ts-expect-error - test shim
    this._readyState = 4;
    // @ts-expect-error - test shim
    this.simulateEvent('loadeddata');
    // @ts-expect-error - test shim
    this.simulateEvent('canplay');
    // @ts-expect-error - test shim
    this.simulateEvent('canplaythrough');
  };

  HTMLMediaElement.prototype.simulatePlay = function (): void {
    // @ts-expect-error - test shim
    this._paused = false;
    // @ts-expect-error - test shim
    this.simulateEvent('play');
    // @ts-expect-error - test shim
    this.simulateEvent('playing');
  };

  HTMLMediaElement.prototype.simulatePause = function (): void {
    // @ts-expect-error - test shim
    this._paused = true;
    // @ts-expect-error - test shim
    this.simulateEvent('pause');
  };

  HTMLMediaElement.prototype.simulateEnd = function (): void {
    // @ts-expect-error - test shim
    this._ended = true;
    // @ts-expect-error - test shim
    this._paused = true;
    // @ts-expect-error - test shim
    this.simulateEvent('ended');
  };
}

// Fallback fetch mock if needed
if (typeof globalThis.fetch === 'undefined') {
  // @ts-expect-error - test shim
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Make logger.error spy-able so tests can call mockRestore()
jest.spyOn(logger, 'error');
