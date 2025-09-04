/**
 * @fileoverview Architecture-Compliant Test Template for Week 6
 * @description Complete test template following established architecture patterns
 * @template Replace: ExampleComponent, useExampleData, example
 * @location app/(features)/[feature]/__tests__/
 * 
 * Required imports for architecture-compliant testing:
 */

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';

// Architecture-compliant testing utilities
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { 
  mockViewport, 
  testBreakpoints, 
  assertResponsiveClasses,
  assertTouchFriendly,
  BREAKPOINTS,
} from '@/app/testUtils/responsiveTestUtils';
import { 
  PerformanceTester,
  testMemoization,
  createPerformanceTestSuite,
} from '@/app/testUtils/performanceTestUtils';
import { 
  renderWithSpecificProviders,
  renderHookWithProviders,
  testSettingsContextIntegration,
  testAudioContextIntegration,
  testBookmarkContextIntegration,
  createContextTestSuite,
} from '@/app/testUtils/contextTestUtils';

// Component under test
import { ExampleComponent } from '../ExampleComponent';
import { useExampleData } from '../hooks/useExampleData';

/**
 * Mock data following domain patterns
 */
const mockExampleData = {
  id: '1',
  verse_key: '1:1',
  title: 'Test Title',
  description: 'Test description',
  content: 'Test content',
  translations: [
    { id: 131, text: 'Test translation', language: 'en' },
  ],
  words: [
    { id: 1, text: 'Test', position: 1 },
  ],
};

/**
 * Mock external dependencies
 */
jest.mock('@/lib/api/client', () => ({
  fetchExampleData: jest.fn(),
  fetchExampleTranslations: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  transformData: jest.fn((data) => data),
  applySettings: jest.fn((text, settings) => text),
}));

jest.mock('@/lib/text/sanitizeHtml', () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

// Mock i18n for consistent testing
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => options?.defaultValue || key
  }),
}));

// Setup responsive testing environment
beforeAll(() => {
  // Mock matchMedia for responsive utilities
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

describe('ExampleComponent - Architecture Compliance', () => {
  const defaultProps = {
    id: '1',
    data: mockExampleData,
    onAction: jest.fn(),
    className: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Reset viewport to mobile-first
    mockViewport(BREAKPOINTS.mobile);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('🏗️ Architecture Compliance', () => {
    it('renders with memo() wrapper (no re-render on same props)', () => {
      const tester = new PerformanceTester(ExampleComponent);
      
      tester
        .render(defaultProps)
        .expectRenderCount(1)
        .rerender(defaultProps)
        .expectNoRerender();
        
      tester.unmount();
    });

    it('has proper TypeScript interface props', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      // Component should render without TypeScript errors
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('integrates with required context providers', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      // Should render without context errors when all providers are available
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });

  describe('📱 Mobile-First Responsive Design', () => {
    it('applies mobile-first responsive classes', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const container = screen.getByTestId('example-component');
      assertResponsiveClasses(container, {
        base: ['space-y-4', 'p-4'],
        md: ['space-y-6', 'p-6', 'flex', 'items-center', 'gap-6'],
      });
    });

    it('adapts to different screen sizes', () => {
      testBreakpoints((breakpointName, width) => {
        mockViewport(breakpointName);
        const { rerender } = renderWithProviders(<ExampleComponent {...defaultProps} />);
        
        const container = screen.getByTestId('example-component');
        
        // Test specific responsive behavior per breakpoint
        if (width >= BREAKPOINTS.desktop) {
          expect(container).toHaveClass('lg:mr-[20.7rem]');
        }
        
        // Clean up for next iteration
        rerender(<></>);
      });
    });

    it('has touch-friendly interactions (min 44px targets)', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const actionButton = screen.getByRole('button', { name: /action/i });
      assertTouchFriendly(actionButton);
      
      // Verify specific touch classes
      expect(actionButton).toHaveClass('min-h-11'); // 44px
      expect(actionButton).toHaveClass('touch-manipulation');
    });

    it('handles viewport changes dynamically', () => {
      const { rerender } = renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      // Start mobile
      mockViewport(BREAKPOINTS.mobile);
      rerender(<ExampleComponent {...defaultProps} />);
      
      // Switch to desktop
      mockViewport(BREAKPOINTS.desktop);
      rerender(<ExampleComponent {...defaultProps} />);
      
      const container = screen.getByTestId('example-component');
      expect(container).toBeInTheDocument(); // Should adapt without errors
    });
  });

  describe('🔄 Context Integration', () => {
    it('integrates with SettingsContext', () => {
      renderWithSpecificProviders(<ExampleComponent {...defaultProps} />, ['Settings']);
      
      // Component should access settings without errors
      const contentElement = screen.getByText(mockExampleData.content);
      expect(contentElement).toBeInTheDocument();
    });

    it('integrates with AudioContext', () => {
      renderWithSpecificProviders(
        <ExampleComponent {...defaultProps} />, 
        ['Settings', 'Audio']
      );
      
      // Component should access audio state without errors
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('integrates with BookmarkContext', () => {
      renderWithSpecificProviders(
        <ExampleComponent {...defaultProps} />, 
        ['Settings', 'Bookmark']
      );
      
      // Component should access bookmark state without errors
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('handles context updates reactively', async () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      fireEvent.click(settingsButton);
      
      // Component should react to context changes
      await waitFor(() => {
        expect(screen.getByTestId('updated-content')).toBeInTheDocument();
      });
    });
  });

  describe('⚡ Performance Optimization', () => {
    it('uses useCallback for event handlers', () => {
      const mockOnAction = jest.fn();
      const { rerender } = renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockOnAction} />
      );
      
      const button = screen.getByRole('button', { name: /action/i });
      const firstHandler = button.onclick;
      
      // Re-render with same callback
      rerender(<ExampleComponent {...defaultProps} onAction={mockOnAction} />);
      const secondHandler = button.onclick;
      
      // Handlers should be the same reference (memoized)
      expect(firstHandler).toBe(secondHandler);
    });

    it('uses useMemo for expensive computations', () => {
      const transformData = require('@/lib/utils/example').transformData;
      
      const { rerender } = renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const initialCalls = transformData.mock.calls.length;
      
      // Re-render with same data should not recompute
      rerender(<ExampleComponent {...defaultProps} />);
      
      expect(transformData.mock.calls.length).toBe(initialCalls);
    });

    it('cleans up effects properly', () => {
      const mockAbort = jest.fn();
      global.AbortController = jest.fn().mockImplementation(() => ({
        abort: mockAbort,
        signal: { aborted: false },
      }));
      
      const { unmount } = renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      unmount();
      
      // Verify cleanup occurred
      expect(mockAbort).toHaveBeenCalled();
    });
  });

  describe('♿ Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const container = screen.getByTestId('example-component');
      expect(container).toHaveAttribute('role');
      expect(container).toHaveAttribute('aria-label');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockOnAction = jest.fn();
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockOnAction} />
      );
      
      const button = screen.getByRole('button', { name: /action/i });
      
      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(mockOnAction).toHaveBeenCalledWith('1');
      
      // Activate with Space
      await user.keyboard(' ');
      expect(mockOnAction).toHaveBeenCalledTimes(2);
    });

    it('provides screen reader support', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const container = screen.getByTestId('example-component');
      expect(container).toHaveAttribute('aria-describedby');
      
      const description = screen.getByText(mockExampleData.description);
      expect(description).toHaveAttribute('id');
    });
  });

  describe('🎯 User Interactions', () => {
    it('handles click events correctly', async () => {
      const mockOnAction = jest.fn();
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockOnAction} />
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
        <ExampleComponent {...defaultProps} onAction={mockOnAction} />
      );
      
      const button = screen.getByRole('button', { name: /action/i });
      
      // Simulate touch interaction
      await user.pointer({ keys: '[TouchA>]', target: button });
      await user.pointer({ keys: '[/TouchA]' });
      
      expect(mockOnAction).toHaveBeenCalled();
    });

    it('provides visual feedback during interactions', async () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /action/i });
      
      fireEvent.mouseDown(button);
      expect(button).toHaveClass('ring-2', 'ring-primary');
      
      fireEvent.mouseUp(button);
      expect(button).not.toHaveClass('ring-2', 'ring-primary');
    });
  });

  describe('🔄 Loading States', () => {
    it('displays loading state correctly', async () => {
      const mockOnAction = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockOnAction} />
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

  describe('❌ Error Handling', () => {
    it('handles errors gracefully', async () => {
      const mockOnAction = jest.fn().mockRejectedValue(new Error('Test error'));
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockOnAction} />
      );
      
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      });
    });
  });
});

describe('useExampleData Hook - Architecture Compliance', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [mockExampleData],
        hasNextPage: false,
      }),
    });
  });

  describe('🔄 Context Integration', () => {
    it('integrates with SettingsContext', async () => {
      const { result } = renderHookWithProviders(
        () => useExampleData({ id: '1' }),
        ['Settings']
      );

      await waitFor(() => {
        expect(result.current.data).toEqual([mockExampleData]);
      });
    });
  });

  describe('⚡ Performance', () => {
    it('returns stable references with as const', async () => {
      const { result, rerender } = renderHookWithProviders(
        () => useExampleData({ id: '1' }),
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
        (props: { id: string }) => useExampleData(props),
        ['Settings'],
        { initialProps: { id: '1' } }
      );

      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
      });

      const initialCalls = transformData.mock.calls.length;
      
      // Re-render with same ID should not transform again
      rerender({ id: '1' });
      
      expect(transformData.mock.calls.length).toBe(initialCalls);
    });
  });

  describe('🧹 Cleanup', () => {
    it('cancels requests on unmount', () => {
      const mockAbort = jest.fn();
      global.AbortController = jest.fn().mockImplementation(() => ({
        abort: mockAbort,
        signal: { aborted: false },
      }));

      const { unmount } = renderHookWithProviders(
        () => useExampleData({ id: '1' }),
        ['Settings']
      );

      unmount();

      expect(mockAbort).toHaveBeenCalled();
    });
  });

  describe('🔄 Data Fetching', () => {
    it('fetches data on mount', async () => {
      const { result } = renderHookWithProviders(
        () => useExampleData({ id: '1' }),
        ['Settings']
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([mockExampleData]);
      });
    });

    it('handles fetch errors properly', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      const { result } = renderHookWithProviders(
        () => useExampleData({ id: '1' }),
        ['Settings']
      );

      await waitFor(() => {
        expect(result.current.error).toBe('API Error');
        expect(result.current.data).toEqual([]);
      });
    });

    it('supports data refetching', async () => {
      const { result } = renderHookWithProviders(
        () => useExampleData({ id: '1' }),
        ['Settings']
      );

      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ ...mockExampleData, title: 'Updated Title' }],
          hasNextPage: false,
        }),
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.data[0].title).toBe('Updated Title');
    });
  });
});

// Generate performance test suite
createPerformanceTestSuite('ExampleComponent', ExampleComponent, defaultProps);

// Generate context test suite
createContextTestSuite('ExampleComponent', ExampleComponent, defaultProps);

describe('🚀 Integration Tests', () => {
  it('works end-to-end with all systems', async () => {
    renderWithProviders(<ExampleComponent {...defaultProps} />);
    
    // Component renders
    expect(screen.getByTestId('example-component')).toBeInTheDocument();
    
    // Responsive design works
    const container = screen.getByTestId('example-component');
    expect(container).toHaveClass('space-y-4', 'md:space-y-6');
    
    // Context integration works
    const button = screen.getByRole('button', { name: /action/i });
    expect(button).toBeInTheDocument();
    
    // Performance optimization works (no unnecessary re-renders)
    // This would be tested with the PerformanceTester
    
    // Accessibility works
    expect(button).toHaveAttribute('aria-label');
    
    // User interactions work
    fireEvent.click(button);
    expect(defaultProps.onAction).toHaveBeenCalled();
  });
});