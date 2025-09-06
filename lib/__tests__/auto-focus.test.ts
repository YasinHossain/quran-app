import { renderHook, act } from '@testing-library/react';

import { useAutoFocus } from '../focus';
import { setupDom } from './focus/test-utils';

describe('useAutoFocus', () => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  it('focuses element when condition is true', async () => {
    const target = container.querySelector('#btn2') as HTMLButtonElement;
    const ref = { current: target };

    renderHook(() => useAutoFocus(true, ref, 10));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });

    expect(document.activeElement).toBe(target);
  });

  it('does not focus element when condition is false', async () => {
    const target = container.querySelector('#btn2') as HTMLButtonElement;
    const ref = { current: target };

    renderHook(() => useAutoFocus(false, ref, 10));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });

    expect(document.activeElement).not.toBe(target);
  });
});
