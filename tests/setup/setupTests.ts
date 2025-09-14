// @ts-nocheck
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Provide Fetch/Response in JSDOM via whatwg-fetch so MSW interceptors work consistently
import 'whatwg-fetch';

import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { TextEncoder, TextDecoder } from 'util';
import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';

import { server } from '@tests/setup/msw/server';
import { logger } from '@/src/infrastructure/monitoring/Logger';

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
}

// TextEncoder/TextDecoder for MSW in JSDOM
Object.assign(global, { TextDecoder, TextEncoder });

// matchMedia polyfill
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
  observe = (el: Element) => {
    if (this.cb) {
      this.cb([{ isIntersecting: true, target: el }], this);
    }
  };
  unobserve = () => {};
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

// ResizeObserver mock
class ResizeObserverMock {
  constructor(private cb: ResizeObserverCallback) {}
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
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
      // @ts-ignore
      return this._currentTime || 0;
    },
    set(value) {
      // @ts-ignore
      this._currentTime = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
    get() {
      // @ts-ignore
      return this._duration || 0;
    },
    set(value) {
      // @ts-ignore
      this._duration = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
    get() {
      // @ts-ignore
      return this._volume !== undefined ? this._volume : 1;
    },
    set(value) {
      // @ts-ignore
      this._volume = Math.max(0, Math.min(1, value));
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    get() {
      // @ts-ignore
      return this._playbackRate || 1;
    },
    set(value) {
      // @ts-ignore
      this._playbackRate = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    get() {
      // @ts-ignore
      return this._paused !== undefined ? this._paused : true;
    },
    set(value) {
      // @ts-ignore
      this._paused = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'ended', {
    get() {
      // @ts-ignore
      return this._ended || false;
    },
    set(value) {
      // @ts-ignore
      this._ended = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
    get() {
      // @ts-ignore
      return this._readyState || 4;
    },
    set(value) {
      // @ts-ignore
      this._readyState = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'networkState', {
    get() {
      // @ts-ignore
      return this._networkState || 1;
    },
    set(value) {
      // @ts-ignore
      this._networkState = value;
    },
    configurable: true,
  });

  HTMLMediaElement.prototype.simulateEvent = function (eventType: string) {
    const event = new Event(eventType);
    this.dispatchEvent(event);
  };

  HTMLMediaElement.prototype.simulateTimeUpdate = function (time: number) {
    // @ts-ignore
    this._currentTime = time;
    // @ts-ignore
    this.simulateEvent('timeupdate');
  };

  HTMLMediaElement.prototype.simulateLoadedData = function (duration = 60) {
    // @ts-ignore
    this._duration = duration;
    // @ts-ignore
    this._readyState = 4;
    // @ts-ignore
    this.simulateEvent('loadeddata');
    // @ts-ignore
    this.simulateEvent('canplay');
    // @ts-ignore
    this.simulateEvent('canplaythrough');
  };

  HTMLMediaElement.prototype.simulatePlay = function () {
    // @ts-ignore
    this._paused = false;
    // @ts-ignore
    this.simulateEvent('play');
    // @ts-ignore
    this.simulateEvent('playing');
  };

  HTMLMediaElement.prototype.simulatePause = function () {
    // @ts-ignore
    this._paused = true;
    // @ts-ignore
    this.simulateEvent('pause');
  };

  HTMLMediaElement.prototype.simulateEnd = function () {
    // @ts-ignore
    this._ended = true;
    // @ts-ignore
    this._paused = true;
    // @ts-ignore
    this.simulateEvent('ended');
  };
}

// Lightweight network isolation: stub QDC API endpoints when MSW is disabled
if (!process.env.JEST_USE_MSW) {
  const realFetch = globalThis.fetch;
  const QDC_BASE = 'https://api.qurancdn.com/api/qdc/';
  function json(data: unknown) {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  globalThis.fetch = async (input: any, init?: any) => {
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
      return json({ ok: true });
    }
    return realFetch
      ? realFetch(input, init)
      : Promise.resolve(new Response('{}', { status: 200 }));
  };
}

// Fallback fetch mock if needed
if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
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
