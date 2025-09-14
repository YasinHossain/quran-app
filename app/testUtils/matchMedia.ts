/**
 * Set a stable matchMedia implementation for the current test.
 * Avoids using jest.fn so global resetMocks won’t clear behavior.
 */
export function setMatchMedia(matches: boolean): void {
  const create = (m: boolean) => (query: string) =>
    ({
      matches: m,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: create(matches),
  });
  // Mirror on global for any code accessing global.matchMedia
  // @ts-expect-error - Node typings don't include matchMedia on global
  global.matchMedia = window.matchMedia;
}
