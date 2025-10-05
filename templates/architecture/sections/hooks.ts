import { waitFor, act } from '@testing-library/react';

import { renderHookWithProviders } from '@/app/testUtils/contextTestUtils';

interface HookResult<TData> {
  data: TData[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

interface HookSectionParams<TProps, TData> {
  useHook: (props: TProps) => HookResult<TData>;
  mockData: TData;
}

export function hookContextIntegrationSection<TProps, TData>({
  useHook,
  mockData
}: HookSectionParams<TProps, TData>): void {
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

export function hookPerformanceSection<TProps, TData>({
  useHook
}: HookSectionParams<TProps, TData>): void {
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

export function hookCleanupSection<TProps, TData>({
  useHook
}: HookSectionParams<TProps, TData>): void {
  describe('🧹 Cleanup', () => {
    it('cancels requests on unmount', () => {
      const mockAbort = jest.fn();
      (globalThis as { AbortController: jest.Mock }).AbortController = jest
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

export function hookDataFetchingSection<TProps, TData>({
  useHook,
  mockData
}: HookSectionParams<TProps, TData>): void {
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
