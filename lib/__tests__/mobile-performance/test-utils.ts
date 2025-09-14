import {
  createMatchMediaMock,
  simulateDevice,
  testPerformance,
} from '@/lib/__tests__/responsive-test-utils';

interface MobilePerformanceTestSetup {
  matchMediaUtils: ReturnType<typeof createMatchMediaMock>;
  cleanup: () => void;
}

let time = 0;

export const setupMobilePerformanceTest = (): MobilePerformanceTestSetup => {
  const matchMediaUtils = createMatchMediaMock();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaUtils.matchMediaMock,
  });

  jest.spyOn(performance, 'now').mockImplementation(() => (time += 16));

  return {
    matchMediaUtils,
    cleanup: () => {
      matchMediaUtils.cleanup();
      jest.restoreAllMocks();
      time = 0;
    },
  };
};

export { simulateDevice, testPerformance };
