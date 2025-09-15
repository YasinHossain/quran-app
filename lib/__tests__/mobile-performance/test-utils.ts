import {
  createMatchMediaMock,
  simulateDevice,
  testPerformance,
} from '@/lib/__tests__/responsive-test-utils';

interface MobilePerformanceTestSetup {
  matchMediaUtils: ReturnType<typeof createMatchMediaMock>;
  cleanup: () => void;
}

let t = 0;
let nowSpy: jest.SpyInstance<number, []>;

export const setupMobilePerformanceTest = (): MobilePerformanceTestSetup => {
  t = 0;
  nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => (t += 16));
  const matchMediaUtils = createMatchMediaMock();
  const originalMatchMedia = window.matchMedia;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaUtils.matchMediaMock,
  });

  return {
    matchMediaUtils,
    cleanup: () => {
      matchMediaUtils.cleanup();
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
      nowSpy.mockRestore();
      t = 0;
    },
  };
};

export { simulateDevice, testPerformance };
