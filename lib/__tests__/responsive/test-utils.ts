import {
  createMatchMediaMock,
  testResponsiveHook,
  devicePresets,
} from '@/lib/__tests__/responsive-test-utils';

/**
 * Set up matchMedia mock for responsive tests
 */
export const setupMatchMediaMock = (): ReturnType<typeof createMatchMediaMock> => {
  const utils = createMatchMediaMock();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: utils.matchMediaMock,
  });
  return utils;
};

export { testResponsiveHook, devicePresets };
