import { renderHook, act } from '@testing-library/react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

import { DevicePreset, createMatchMediaMock, simulateDevice } from './breakpoints';

/**
 * Test responsive hook behavior across breakpoints
 */
export const testResponsiveHook = async <T>(
  hook: () => T,
  testCases: Array<{
    device: DevicePreset | number;
    expected: Partial<T>;
    description: string;
  }>
): Promise<Array<{ device: DevicePreset | number; result: T; expected: Partial<T> }>> => {
  const matchMediaUtils = createMatchMediaMock();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaUtils.matchMediaMock,
  });

  const results: Array<{ device: DevicePreset | number; result: T; expected: Partial<T> }> = [];

  for (const testCase of testCases) {
    const device = simulateDevice(testCase.device);
    matchMediaUtils.setViewportWidth(device.width);

    const { result } = renderHook(hook);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    results.push({
      device: testCase.device,
      result: result.current,
      expected: testCase.expected,
    });

    Object.entries(testCase.expected).forEach(([key, expectedValue]) => {
      expect(result.current).toHaveProperty(key, expectedValue);
    });
  }

  matchMediaUtils.cleanup();
  return results;
};

/**
 * Responsive component testing wrapper
 */
interface ResponsiveRenderOptions extends RenderOptions {
  device?: DevicePreset | number;
  mockMatchMedia?: boolean;
}

export const renderResponsive = (
  ui: ReactElement,
  options: ResponsiveRenderOptions = {}
): ReturnType<typeof render> & {
  setDevice: (newDevice: DevicePreset | number) => void;
  cleanup: () => void;
} => {
  const { device = 'Desktop Small', mockMatchMedia = true, ...renderOptions } = options;

  let matchMediaUtils: ReturnType<typeof createMatchMediaMock> | undefined;

  if (mockMatchMedia) {
    matchMediaUtils = createMatchMediaMock();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaUtils.matchMediaMock,
    });
  }

  const deviceConfig = simulateDevice(device);
  if (matchMediaUtils) {
    matchMediaUtils.setViewportWidth(deviceConfig.width);
  }

  const result = render(ui, renderOptions);

  return {
    ...result,
    setDevice: (newDevice: DevicePreset | number) => {
      const newDeviceConfig = simulateDevice(newDevice);
      if (matchMediaUtils) {
        matchMediaUtils.setViewportWidth(newDeviceConfig.width);
      }
    },
    cleanup: () => {
      if (matchMediaUtils) {
        matchMediaUtils.cleanup();
      }
    },
  };
};
