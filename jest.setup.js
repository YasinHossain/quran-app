/* eslint-disable @typescript-eslint/explicit-function-return-type */
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Provide Fetch/Response in JSDOM via whatwg-fetch so MSW interceptors work consistently
import 'whatwg-fetch';
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';

import { jest } from '@jest/globals';

import { logger } from '@/src/infrastructure/monitoring/Logger';

// Provide Web Streams in Node test environment for MSW/@mswjs/interceptors
if (typeof globalThis.ReadableStream === 'undefined') {
  // @ts-ignore - define if missing
  globalThis.ReadableStream = ReadableStream;
}
if (typeof globalThis.WritableStream === 'undefined') {
  // @ts-ignore - define if missing
  globalThis.WritableStream = WritableStream;
}
if (typeof globalThis.TransformStream === 'undefined') {
  // @ts-ignore - define if missing
  globalThis.TransformStream = TransformStream;
}
// Provide BroadcastChannel stub required by MSW in Node
if (typeof globalThis.BroadcastChannel === 'undefined') {
  // @ts-ignore
  globalThis.BroadcastChannel = class {
    constructor() {}

    postMessage() {}

    close() {}

    addEventListener() {}

    removeEventListener() {}
    onmessage = null;
  };
}
// Lightweight network isolation: stub QDC API endpoints commonly hit in UI tests
// to avoid real network calls and speed up test runs without starting MSW.
// Guard behind environment flag to allow MSW to handle requests when enabled.
if (!process.env.JEST_USE_MSW) {
  (() => {
    const realFetch = globalThis.fetch;
    const QDC_BASE = 'https://api.qurancdn.com/api/qdc/';
    function json(data) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    globalThis.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input?.toString?.() || '';
      if (url.startsWith(QDC_BASE)) {
        const u = new URL(url);
        const path = u.pathname.replace(/^\/api\/qdc\//, '');
        if (path === 'chapters') {
          return json({
            chapters: [
              {
                id: 1,
                name_simple: 'Al-Fatihah',
                name_arabic: 'الفاتحة',
                verses_count: 7,
                translated_name: { name: 'The Opening' },
              },
            ],
          });
        }
        if (path.startsWith('verses/by_chapter/')) {
          const chapterId = Number(path.split('/').pop());
          return json({
            verses: [
              { id: 1, chapter_id: chapterId, verse_key: `${chapterId}:1`, text_uthmani: 'بِسْمِ' },
            ],
            pagination: { page: 1, per_page: 10, total_pages: 1, total_records: 1 },
          });
        }
        if (path.startsWith('verses/by_key/')) {
          const verseKey = decodeURIComponent(path.split('/').pop() || '1:1');
          return json({ verse: { id: 1, verse_key: verseKey, text_uthmani: 'بِسْمِ' } });
        }
        if (path === 'resources/translations') {
          return json({
            translations: [
              {
                id: 131,
                name: 'Sahih International',
                author_name: 'Sahih International',
                translated_name: { name: 'Sahih International' },
              },
            ],
          });
        }
        if (path.startsWith('quran/translations/')) {
          const params = u.searchParams;
          const c = params.get('chapter_number') || '1';
          const v = params.get('verse_number') || '1';
          return json({
            translations: [
              { id: 1, resource_id: 131, verse_key: `${c}:${v}`, text: 'In the name of Allah...' },
            ],
          });
        }
        if (path === 'verses/random') {
          return json({ verse: { id: 1, verse_key: '1:1', text_uthmani: 'بِسْمِ' } });
        }
        // Fallback for unrecognized QDC endpoints
        return json({ ok: true });
      }
      return realFetch
        ? realFetch(input, init)
        : Promise.resolve(new Response('{}', { status: 200 }));
    };
  })();
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
