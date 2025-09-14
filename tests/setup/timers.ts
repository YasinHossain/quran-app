// Deterministic timer utilities for tests
// Use these helpers instead of direct setTimeout/setInterval in tests

/**
 * Setup fake timers for deterministic test timing
 * Call this in beforeEach() for tests that need timer control
 */
export const setupFakeTimers = () => {
  jest.useFakeTimers();
};

/**
 * Cleanup fake timers
 * Call this in afterEach() for tests that used setupFakeTimers
 */
export const cleanupFakeTimers = () => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
};

/**
 * Advance timers by specified milliseconds
 * Use instead of arbitrary waits in tests
 */
export const advanceTimersByTime = (ms: number) => {
  jest.advanceTimersByTime(ms);
};

/**
 * Run all pending timers immediately
 * Use when you need all scheduled work to complete
 */
export const runAllTimers = () => {
  jest.runAllTimers();
};

/**
 * Deterministic sleep for tests - works with both real and fake timers
 * Use this instead of new Promise(resolve => setTimeout(resolve, ms))
 */
export const testSleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
