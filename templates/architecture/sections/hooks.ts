import { waitFor, act } from '@testing-library/react';

import { renderHookWithProviders } from '@/app/testUtils/contextTestUtils';

interface HookSectionParams {
  useHook: (props: any) => any;
  mockData: any;
}

export function hookContextIntegrationSection({
  useHook,
  mockData
}: HookSectionParams) {
  describe('🔄 Context Integration', () => {
    it('provides data from context', async () => {
      const { result } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      await waitFor(() => {
        expect(result.current.data).toEqual([mockData]);
      });
    });
  });
}

export function hookPerformanceSection({
  useHook
}: HookSectionParams) {
  describe('⚡ Performance', () => {
    it('returns stable references', async () => {
      const { result, rerender } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      const first = result.current.refetch;
      rerender();
      expect(result.current.refetch).toBe(first);
    });
  });
}

export function hookCleanupSection({
  useHook
}: HookSectionParams) {
  describe('🧹 Cleanup', () => {
    it('cancels requests on unmount', () => {
      const mockAbort = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).AbortController = jest
        .fn()
        .mockImplementation(() => ({ abort: mockAbort, signal: {} }));
      const { unmount } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      unmount();
      expect(mockAbort).toHaveBeenCalled();
    });
  });
}

export function hookDataFetchingSection({
  useHook,
  mockData
}: HookSectionParams) {
  describe('🔄 Data Fetching', () => {
    it('supports refetching', async () => {
      const { result } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
      });
      await act(async () => {
        await result.current.refetch();
      });
      expect(result.current.data).toBeTruthy();
      expect(result.current.data).toEqual([mockData]);
    });
  });
}
