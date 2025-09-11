import { renderHook, act } from '@testing-library/react';

import { useResponsiveState } from '@/lib/responsive';

import { setupMobilePerformanceTest, simulateDevice } from './test-utils';

describe('User Interactions Performance', () => {
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

  it('should handle typical user interactions efficiently', async () => {
    simulateDevice('iPhone 12 Pro');
    const { result } = renderHook(() => useResponsiveState());
    const startTime = performance.now();

    const scenarios = [
      () => matchMediaUtils.setViewportWidth(390),
      () => matchMediaUtils.setViewportWidth(844),
      () => matchMediaUtils.setViewportWidth(390),
      () => matchMediaUtils.setViewportWidth(375),
    ];

    for (const scenario of scenarios) {
      scenario();
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 16));
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(100);
    expect(result.current.isMobile).toBe(true);
  });
});

describe('Complex Layouts Performance', () => {
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupMobilePerformanceTest();
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it('should maintain performance during complex responsive layouts', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="responsive-grid">
        ${Array.from({ length: 50 }, (_, i) => `<div class="grid-item">Item ${i + 1}</div>`).join('')}
      </div>
    `;
    document.body.appendChild(container);

    const startTime = performance.now();

    simulateDevice('iPhone SE');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    simulateDevice('iPad');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    simulateDevice('Desktop Small');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(150);
    document.body.removeChild(container);
  });
});
