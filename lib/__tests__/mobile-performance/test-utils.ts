import { createMatchMediaMock, simulateDevice, testPerformance } from '../responsive-test-utils';

export const setupMobilePerformanceTest = () => {
  const matchMediaUtils = createMatchMediaMock();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaUtils.matchMediaMock,
  });

  jest.spyOn(performance, 'now').mockImplementation(() => Date.now());

  return {
    matchMediaUtils,
    cleanup: () => {
      matchMediaUtils.cleanup();
      jest.restoreAllMocks();
    },
  };
};

export { simulateDevice, testPerformance };
