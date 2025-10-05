import { renderHook, act } from '@testing-library/react';

import { useResponsiveFocus } from '@/lib/focus';

import { setupDom } from './focus/test-utils';

describe('useResponsiveFocus', () => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  it('restores focus after breakpoint change', async () => {
    const button = container.querySelector('#btn1') as HTMLButtonElement;
    button.focus();

    const initialProps: { bp: 'mobile' | 'tablet' | 'desktop' } = { bp: 'mobile' };
    const { rerender } = renderHook(
      ({ bp }: { bp: 'mobile' | 'tablet' | 'desktop' }) => useResponsiveFocus(bp, true),
      { initialProps }
    );

    act(() => {
      rerender({ bp: 'desktop' as const });
    });

    document.body.focus();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 200));
    });

    expect(document.activeElement).toBe(button);
  });

  it('skips restoration when disabled', async () => {
    // Don't focus the button initially when the hook is disabled
    const initialProps2: { bp: 'mobile' | 'tablet' | 'desktop'; enabled: boolean } = {
      bp: 'mobile',
      enabled: false,
    };
    const { rerender } = renderHook(
      ({ bp, enabled }: { bp: 'mobile' | 'tablet' | 'desktop'; enabled: boolean }) =>
        useResponsiveFocus(bp, enabled),
      { initialProps: initialProps2 }
    );

    act(() => {
      rerender({ bp: 'desktop' as const, enabled: false });
    });

    // Set focus manually to body
    document.body.focus();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 200));
    });

    // When disabled, focus should remain where it was manually set (body)
    expect(document.activeElement).toBe(document.body);
  });
});
