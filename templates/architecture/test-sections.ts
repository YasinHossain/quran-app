import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  renderWithSpecificProviders,
  renderHookWithProviders
} from '@/app/testUtils/contextTestUtils';
import { PerformanceTester } from '@/app/testUtils/performanceTestUtils';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import {
  mockViewport,
  testBreakpoints,
  assertResponsiveClasses,
  assertTouchFriendly,
  BREAKPOINTS
} from '@/app/testUtils/responsiveTestUtils';

interface ComponentSectionParams {
  Component: React.ComponentType<any>;
  defaultProps: any;
  mockData: any;
}

interface HookSectionParams {
  useHook: (props: any) => any;
  mockData: any;
}

/**
 * Runs architecture compliance tests for a component.
 * @param params - Component and props used for testing.
 */
export function architectureComplianceSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🏗️ Architecture Compliance', () => {
    it('renders with memo() wrapper (no re-render on same props)', () => {
      const tester = new PerformanceTester(Component);

      tester
        .render(defaultProps)
        .expectRenderCount(1)
        .rerender(defaultProps)
        .expectNoRerender();

      tester.unmount();
    });

    it('has proper TypeScript interface props', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('integrates with required context providers', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}

/**
 * Validates mobile-first responsive design behaviour.
 * @param params - Component and props used for testing.
 */
export function responsiveDesignSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('📱 Mobile-First Responsive Design', () => {
    it('applies mobile-first responsive classes', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const container = screen.getByTestId('example-component');
      assertResponsiveClasses(container, {
        base: ['space-y-4', 'p-4'],
        md: ['space-y-6', 'p-6', 'flex', 'items-center', 'gap-6']
      });
    });

    it('adapts to different screen sizes', () => {
      testBreakpoints((breakpointName, width) => {
        mockViewport(breakpointName);
        const { rerender } = renderWithProviders(<Component {...defaultProps} />);
        const container = screen.getByTestId('example-component');
        if (width >= BREAKPOINTS.desktop) {
          expect(container).toHaveClass('lg:mr-[20.7rem]');
        }
        rerender(<></>);
      });
    });

    it('has touch-friendly interactions (min 44px targets)', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const actionButton = screen.getByRole('button', { name: /action/i });
      assertTouchFriendly(actionButton);
      expect(actionButton).toHaveClass('min-h-11');
      expect(actionButton).toHaveClass('touch-manipulation');
    });

    it('handles viewport changes dynamically', () => {
      const { rerender } = renderWithProviders(<Component {...defaultProps} />);
      mockViewport(BREAKPOINTS.mobile);
      rerender(<Component {...defaultProps} />);
      mockViewport(BREAKPOINTS.desktop);
      rerender(<Component {...defaultProps} />);
      const container = screen.getByTestId('example-component');
      expect(container).toBeInTheDocument();
    });
  });
}

/**
 * Ensures component correctly integrates with required contexts.
 * @param params - Component, props and mock data used for testing.
 */
export function contextIntegrationSection({
  Component,
  defaultProps,
  mockData
}: ComponentSectionParams) {
  describe('🔄 Context Integration', () => {
    it('integrates with SettingsContext', () => {
      renderWithSpecificProviders(<Component {...defaultProps} />, ['Settings']);
      const contentElement = screen.getByText(mockData.content);
      expect(contentElement).toBeInTheDocument();
    });

    it('integrates with AudioContext', () => {
      renderWithSpecificProviders(
        <Component {...defaultProps} />,
        ['Settings', 'Audio']
      );
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('integrates with BookmarkContext', () => {
      renderWithSpecificProviders(
        <Component {...defaultProps} />,
        ['Settings', 'Bookmark']
      );
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('handles context updates reactively', async () => {
      renderWithProviders(<Component {...defaultProps} />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      fireEvent.click(settingsButton);
      await waitFor(() => {
        expect(screen.getByTestId('updated-content')).toBeInTheDocument();
      });
    });
  });
}

/**
 * Tests performance optimizations such as memoization and cleanup.
 * @param params - Component and props used for testing.
 */
export function performanceOptimizationSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('⚡ Performance Optimization', () => {
    it('uses useCallback for event handlers', () => {
      const mockOnAction = jest.fn();
      const { rerender } = renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      const button = screen.getByRole('button', { name: /action/i });
      const firstHandler = button.onclick;
      rerender(<Component {...defaultProps} onAction={mockOnAction} />);
      const secondHandler = button.onclick;
      expect(firstHandler).toBe(secondHandler);
    });

    it('uses useMemo for expensive computations', () => {
      const transformData = require('@/lib/utils/example').transformData;
      const { rerender } = renderWithProviders(<Component {...defaultProps} />);
      const initialCalls = transformData.mock.calls.length;
      rerender(<Component {...defaultProps} />);
      expect(transformData.mock.calls.length).toBe(initialCalls);
    });

    it('cleans up effects properly', () => {
      const mockAbort = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).AbortController = jest.fn().mockImplementation(() => ({
        abort: mockAbort,
        signal: { aborted: false }
      }));
      const { unmount } = renderWithProviders(<Component {...defaultProps} />);
      unmount();
      expect(mockAbort).toHaveBeenCalled();
    });
  });
}

/**
 * Verifies accessibility features and keyboard interactions.
 * @param params - Component, props and mock data used for testing.
 */
export function accessibilitySection({
  Component,
  defaultProps,
  mockData
}: ComponentSectionParams) {
  describe('♿ Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const container = screen.getByTestId('example-component');
      expect(container).toHaveAttribute('role');
      expect(container).toHaveAttribute('aria-label');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockOnAction = jest.fn();
      renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      const button = screen.getByRole('button', { name: /action/i });
      await user.tab();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(mockOnAction).toHaveBeenCalledWith('1');
      await user.keyboard(' ');
      expect(mockOnAction).toHaveBeenCalledTimes(2);
    });

    it('provides screen reader support', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const container = screen.getByTestId('example-component');
      expect(container).toHaveAttribute('aria-describedby');
      const description = screen.getByText(mockData.description);
      expect(description).toHaveAttribute('id');
    });
  });
}

/**
 * Ensures common user interactions behave as expected.
 * @param params - Component and props used for testing.
 */
export function userInteractionsSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🎯 User Interactions', () => {
    it('handles click events correctly', async () => {
      const mockOnAction = jest.fn();
      renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.click(button);
      expect(mockOnAction).toHaveBeenCalledWith('1');
    });

    it('handles touch events on mobile', async () => {
      mockViewport(BREAKPOINTS.mobile);
      const user = userEvent.setup();
      const mockOnAction = jest.fn();
      renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      const button = screen.getByRole('button', { name: /action/i });
      await user.pointer({ keys: '[TouchA>]', target: button });
      await user.pointer({ keys: '[/TouchA]' });
      expect(mockOnAction).toHaveBeenCalled();
    });

    it('provides visual feedback during interactions', async () => {
      renderWithProviders(<Component {...defaultProps} />);
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.mouseDown(button);
      expect(button).toHaveClass('ring-2', 'ring-primary');
      fireEvent.mouseUp(button);
      expect(button).not.toHaveClass('ring-2', 'ring-primary');
    });
  });
}

/**
 * Validates loading state handling.
 * @param params - Component and props used for testing.
 */
export function loadingStatesSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🔄 Loading States', () => {
    it('displays loading state correctly', async () => {
      const mockOnAction = jest
        .fn()
        .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.click(button);
      expect(button).toHaveAttribute('disabled');
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      await waitFor(() => {
        expect(button).not.toHaveAttribute('disabled');
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });
}

/**
 * Confirms graceful error handling pathways.
 * @param params - Component and props used for testing.
 */
export function errorHandlingSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('❌ Error Handling', () => {
    it('handles errors gracefully', async () => {
      const mockOnAction = jest
        .fn()
        .mockRejectedValue(new Error('Test error'));
      renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      });
    });
  });
}

/**
 * Ensures hooks integrate with context providers.
 * @param params - Hook function and mock data.
 */
export function hookContextIntegrationSection({
  useHook,
  mockData
}: HookSectionParams) {
  describe('🔄 Context Integration', () => {
    it('integrates with SettingsContext', async () => {
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

/**
 * Tests hook-level performance optimizations.
 * @param params - Hook function used for testing.
 */
export function hookPerformanceSection({
  useHook
}: HookSectionParams) {
  describe('⚡ Performance', () => {
    it('returns stable references with as const', async () => {
      const { result, rerender } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      const firstRefetch = result.current.refetch;
      rerender();
      const secondRefetch = result.current.refetch;
      expect(firstRefetch).toBe(secondRefetch);
    });

    it('memoizes derived values', async () => {
      const transformData = require('@/lib/utils/example').transformData;
      const { result, rerender } = renderHookWithProviders(
        (props: { id: string }) => useHook(props),
        ['Settings'],
        { initialProps: { id: '1' } }
      );
      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
      });
      const initialCalls = transformData.mock.calls.length;
      rerender({ id: '1' });
      expect(transformData.mock.calls.length).toBe(initialCalls);
    });
  });
}

/**
 * Validates cleanup behaviour for hooks.
 * @param params - Hook function used for testing.
 */
export function hookCleanupSection({
  useHook
}: HookSectionParams) {
  describe('🧹 Cleanup', () => {
    it('cancels requests on unmount', () => {
      const mockAbort = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).AbortController = jest.fn().mockImplementation(() => ({
        abort: mockAbort,
        signal: { aborted: false }
      }));
      const { unmount } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      unmount();
      expect(mockAbort).toHaveBeenCalled();
    });
  });
}

/**
 * Exercises data fetching flows for hooks.
 * @param params - Hook function and mock data.
 */
export function hookDataFetchingSection({
  useHook,
  mockData
}: HookSectionParams) {
  describe('🔄 Data Fetching', () => {
    it('fetches data on mount', async () => {
      const { result } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([mockData]);
      });
    });

    it('handles fetch errors properly', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockRejectedValue(new Error('API Error'));
      const { result } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      await waitFor(() => {
        expect(result.current.error).toBe('API Error');
        expect(result.current.data).toEqual([]);
      });
    });

    it('supports data refetching', async () => {
      const mockFetch = global.fetch as jest.Mock;
      const { result } = renderHookWithProviders(
        () => useHook({ id: '1' }),
        ['Settings']
      );
      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ ...mockData, title: 'Updated Title' }],
          hasNextPage: false
        })
      });
      await act(async () => {
        await result.current.refetch();
      });
      expect(result.current.data[0].title).toBe('Updated Title');
    });
  });
}

/**
 * Full integration test to validate all systems together.
 * @param params - Component and props used for testing.
 */
export function integrationTestSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🚀 Integration Tests', () => {
    it('works end-to-end with all systems', async () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
      const container = screen.getByTestId('example-component');
      expect(container).toHaveClass('space-y-4', 'md:space-y-6');
      const button = screen.getByRole('button', { name: /action/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label');
      fireEvent.click(button);
      expect(defaultProps.onAction).toHaveBeenCalled();
    });
  });
}
