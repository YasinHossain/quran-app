import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { RouteProgressBar } from '@/app/shared/navigation/progress/RouteProgressBar';
import { useProgressRouter } from '@/app/shared/navigation/progress/useProgressRouter';

const usePathnameMock = usePathname as jest.Mock;

function renderBar(): { rerender: () => void } {
  const view = render(
    <>
      <RouteProgressBar />
      <a href="/surah/al-baqarah">Next surah</a>
      <a href="https://example.com/elsewhere">External</a>
      <a href="/#verse-3">Same page anchor</a>
      <a href="/surah/al-imran" target="_blank">
        New tab
      </a>
    </>
  );
  return { rerender: () => view.rerender(<RouteProgressBar />) };
}

const barState = (): string | null =>
  screen.getByTestId('route-progress').getAttribute('data-state');

describe('RouteProgressBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/');
    usePathnameMock.mockReturnValue('/');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('runs from an in-app link click until the new page commits', () => {
    const { rerender } = renderBar();
    expect(barState()).toBe('idle');

    fireEvent.click(screen.getByText('Next surah'));
    expect(barState()).toBe('loading');

    usePathnameMock.mockReturnValue('/surah/al-baqarah');
    rerender();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(barState()).toBe('complete');
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(barState()).toBe('idle');
  });

  it('ignores clicks that do not load another in-app page', () => {
    renderBar();

    fireEvent.click(screen.getByText('External'));
    fireEvent.click(screen.getByText('Same page anchor'));
    fireEvent.click(screen.getByText('New tab'));
    fireEvent.click(screen.getByText('Next surah'), { metaKey: true });

    expect(barState()).toBe('idle');
  });

  it('starts for router pushes to another page', () => {
    renderBar();
    const { result } = renderHook(() => useProgressRouter());

    act(() => result.current.push('/'));
    expect(barState()).toBe('idle');

    act(() => result.current.push('/juz/2'));
    expect(barState()).toBe('loading');
    expect(globalThis.__NEXT_ROUTER_MOCK__?.push).toHaveBeenCalledWith('/juz/2');
  });

  it('gives up if the navigation never commits', () => {
    renderBar();
    fireEvent.click(screen.getByText('Next surah'));

    act(() => {
      jest.advanceTimersByTime(11_000);
    });
    expect(barState()).not.toBe('loading');
  });
});
