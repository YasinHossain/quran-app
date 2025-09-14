import { renderHook, act } from '@testing-library/react';

import { useResponsiveState } from '@/lib/responsive';

import { setupMobilePerformanceTest } from './test-utils';

describe('Accessibility Performance', () => {
  let matchMediaUtils: ReturnType<typeof setupMobilePerformanceTest>['matchMediaUtils'];
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupMobilePerformanceTest();
    matchMediaUtils = setup.matchMediaUtils;
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it('should maintain focus performance during responsive changes', async () => {
    const focusableElement = document.createElement('button');
    focusableElement.textContent = 'Test Button';
    document.body.appendChild(focusableElement);

    focusableElement.focus();

    const startTime = performance.now();

    matchMediaUtils.setViewportWidth(375);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    matchMediaUtils.setViewportWidth(768);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const endTime = performance.now();
    const focusTime = endTime - startTime;

    expect(focusTime).toBe(16);
    expect(document.activeElement).toBe(focusableElement);

    document.body.removeChild(focusableElement);
  });

  it('should optimize screen reader announcements', async () => {
    const announcementSpy = jest.spyOn(console, 'log').mockImplementation();

    renderHook(() => useResponsiveState());

    matchMediaUtils.setViewportWidth(375);
    matchMediaUtils.setViewportWidth(768);
    matchMediaUtils.setViewportWidth(1024);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(announcementSpy).toHaveBeenCalledTimes(0);

    announcementSpy.mockRestore();
  });
});
