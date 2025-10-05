import { jest } from '@jest/globals';

type MediaElementShim = HTMLMediaElement & {
  [key: `_${string}`]: unknown;
};

const createMatchMedia = (matches = false) => {
  return (query: string): MediaQueryList => {
    return {
      matches,
      media: query,
      onchange: null,
      addListener: (): void => {},
      removeListener: (): void => {},
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
      dispatchEvent: (): boolean => false,
    } as unknown as MediaQueryList;
  };
};

class IntersectionObserverMock {
  constructor(private readonly cb: IntersectionObserverCallback) {}

  observe = (element: Element): void => {
    if (this.cb) {
      this.cb(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      );
    }
  };

  unobserve = (): void => {};

  disconnect = (): void => {};
}

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    void callback;
  }

  observe = (): void => {};

  unobserve = (): void => {};

  disconnect = (): void => {};
}

const defineWindowProperty = (key: string, value: unknown): void => {
  const target = window as unknown as Record<string, unknown>;
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value,
  });
};

const defineGlobal = (key: string, value: unknown): void => {
  const target = globalThis as unknown as Record<string, unknown>;
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value,
  });
};

const defineMediaProperty = (
  key: keyof MediaElementShim & string,
  defaultValue: unknown,
  transformer?: (value: unknown) => unknown
): void => {
  Object.defineProperty(HTMLMediaElement.prototype, key, {
    get(this: MediaElementShim) {
      return this[`_${key}`] ?? defaultValue;
    },
    set(this: MediaElementShim, value: unknown) {
      this[`_${key}`] = transformer ? transformer(value) : value;
    },
    configurable: true,
  });
};

const clampVolume = (value: unknown): number => {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return 1;
  }

  return Math.max(0, Math.min(1, numericValue));
};

const installClipboardMock = (): void => {
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: () => Promise.resolve(),
    },
  });
};

const installMatchMediaMock = (): void => {
  const matchMedia = createMatchMedia(false);
  defineWindowProperty('matchMedia', matchMedia);
  defineGlobal('matchMedia', matchMedia as typeof globalThis.matchMedia);
};

const installIntersectionObserverMock = (): void => {
  defineWindowProperty(
    'IntersectionObserver',
    IntersectionObserverMock as unknown as typeof IntersectionObserver
  );
  defineGlobal(
    'IntersectionObserver',
    IntersectionObserverMock as unknown as typeof IntersectionObserver
  );
};

const installResizeObserverMock = (): void => {
  defineWindowProperty('ResizeObserver', ResizeObserverMock as unknown as typeof ResizeObserver);
  defineGlobal('ResizeObserver', ResizeObserverMock as unknown as typeof ResizeObserver);
};

const installMediaElementMocks = (): void => {
  const prototype = HTMLMediaElement.prototype;

  prototype.play = jest.fn(() => Promise.resolve());
  prototype.pause = jest.fn();
  prototype.load = jest.fn();
  prototype.canPlayType = jest.fn(() => 'probably') as unknown as HTMLMediaElement['canPlayType'];

  defineMediaProperty('currentTime', 0);
  defineMediaProperty('duration', 0);
  defineMediaProperty('playbackRate', 1);
  defineMediaProperty('paused', true);
  defineMediaProperty('ended', false);
  defineMediaProperty('readyState', 4);
  defineMediaProperty('networkState', 1);
  defineMediaProperty('volume', 1, clampVolume);

  prototype.simulateEvent = function (this: MediaElementShim, eventType: string): void {
    const event = new Event(eventType);
    this.dispatchEvent(event);
  };

  prototype.simulateTimeUpdate = function (this: MediaElementShim, time: number): void {
    this['_currentTime'] = time;
    this.simulateEvent('timeupdate');
  };

  prototype.simulateLoadedData = function (this: MediaElementShim, duration = 60): void {
    this['_duration'] = duration;
    this['_readyState'] = 4;
    this.simulateEvent('loadeddata');
    this.simulateEvent('canplay');
    this.simulateEvent('canplaythrough');
  };

  prototype.simulatePlay = function (this: MediaElementShim): void {
    this['_paused'] = false;
    this.simulateEvent('play');
    this.simulateEvent('playing');
  };

  prototype.simulatePause = function (this: MediaElementShim): void {
    this['_paused'] = true;
    this.simulateEvent('pause');
  };

  prototype.simulateEnd = function (this: MediaElementShim): void {
    this['_ended'] = true;
    this['_paused'] = true;
    this.simulateEvent('ended');
  };
};

const installBrowserMocks = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  installMatchMediaMock();
  installIntersectionObserverMock();
  installResizeObserverMock();
  installClipboardMock();
  installMediaElementMocks();
};

installBrowserMocks();
