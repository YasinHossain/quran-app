// matchMedia polyfill
const createMatchMedia =
  (matches = false): ((query: string) => MediaQueryList) =>
  (query: string): MediaQueryList => ({
    matches,
    media: query,
    onchange: null,
    addListener: (): void => {},
    removeListener: (): void => {},
    addEventListener: (): void => {},
    removeEventListener: (): void => {},
    dispatchEvent: (): boolean => false,
  }) as unknown as MediaQueryList;

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
    this.cb?.([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], this);
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
