// Test Template - Copy this pattern for component/hook testing
// Replace: ExampleComponent, useExampleData, example
// Location: app/(features)/[feature]/__tests__/

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';
import { useExampleData } from '../hooks/useExampleData';

// Test providers wrapper
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

// Mock data
const mockExampleData = {
  id: '1',
  title: 'Test Title',
  description: 'Test description',
  content: 'Test content',
};

// Test wrapper with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    <BookmarkProvider>
      <AudioProvider>
        {children}
      </AudioProvider>
    </BookmarkProvider>
  </SettingsProvider>
);

// Custom render function with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

// Mock external dependencies
jest.mock('@/lib/api', () => ({
  fetchExampleData: jest.fn(),
}));

jest.mock('@/lib/utils/example', () => ({
  transformData: jest.fn((data) => data),
  applySettings: jest.fn((text, settings) => text),
}));

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('ExampleComponent', () => {
  const defaultProps = {
    id: '1',
    data: mockExampleData,
    onAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('applies active state styling', () => {
      renderWithProviders(
        <ExampleComponent {...defaultProps} isActive={true} />
      );
      
      const container = screen.getByRole('button');
      expect(container).toHaveClass('ring-2', 'ring-primary');
    });

    it('handles loading state', async () => {
      const mockAction = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockAction} />
      );
      
      const button = screen.getByRole('button', { name: /perform action/i });
      fireEvent.click(button);
      
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
      
      await waitFor(() => {
        expect(button).toHaveTextContent('Action');
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Interactions', () => {
    it('handles click events', () => {
      const mockAction = jest.fn();
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockAction} />
      );
      
      const button = screen.getByRole('button', { name: /perform action/i });
      fireEvent.click(button);
      
      expect(mockAction).toHaveBeenCalledWith('1');
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockAction = jest.fn();
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockAction} />
      );
      
      const container = screen.getByRole('button');
      await user.click(container);
      await user.keyboard('{Enter}');
      
      expect(mockAction).toHaveBeenCalledWith('1');
    });

    it('handles space key activation', async () => {
      const user = userEvent.setup();
      const mockAction = jest.fn();
      
      renderWithProviders(
        <ExampleComponent {...defaultProps} onAction={mockAction} />
      );
      
      const container = screen.getByRole('button');
      container.focus();
      await user.keyboard(' ');
      
      expect(mockAction).toHaveBeenCalledWith('1');
    });
  });

  describe('Context Integration', () => {
    it('integrates with settings context', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      // Settings should be applied (fontSize from context)
      const contentElement = screen.getByText('Test content');
      expect(contentElement).toHaveStyle({ fontSize: '16px' });
    });

    it('shows bookmark status', () => {
      // Mock bookmark context to return true for this ID
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      // Should show bookmarked indicator based on context
      // This would require mocking the BookmarkContext
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const mainContainer = screen.getByRole('button').firstChild;
      expect(mainContainer).toHaveClass(
        'space-y-4',
        'md:space-y-0',
        'md:flex',
        'md:items-start',
        'md:gap-x-6'
      );
    });

    it('has proper touch targets', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /perform action/i });
      expect(button).toHaveClass('h-11'); // 44px minimum
      expect(button).toHaveClass('touch-manipulation');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const container = screen.getByRole('button');
      expect(container).toHaveAttribute('tabIndex', '0');
      expect(container).toHaveAttribute('aria-label', 'Action for Test Title');
    });

    it('supports keyboard navigation', () => {
      renderWithProviders(<ExampleComponent {...defaultProps} />);
      
      const container = screen.getByRole('button');
      expect(container).toHaveAttribute('tabIndex', '0');
    });
  });
});

describe('useExampleData Hook', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    mockFetch.mockClear();
    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [mockExampleData],
        hasNextPage: false,
      }),
    });
  });

  it('fetches data on mount', async () => {
    const { result } = renderHook(
      () => useExampleData({ id: '1' }),
      { wrapper: TestWrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual([mockExampleData]);
    });
  });

  it('handles fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(
      () => useExampleData({ id: '1' }),
      { wrapper: TestWrapper }
    );

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
      expect(result.current.data).toEqual([]);
    });
  });

  it('refetches data', async () => {
    const { result } = renderHook(
      () => useExampleData({ id: '1' }),
      { wrapper: TestWrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([mockExampleData]);
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

  it('loads more data for pagination', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [mockExampleData],
          hasNextPage: true,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ ...mockExampleData, id: '2', title: 'Page 2' }],
          hasNextPage: false,
        }),
      });

    const { result } = renderHook(
      () => useExampleData({ id: '1' }),
      { wrapper: TestWrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
      expect(result.current.hasNextPage).toBe(true);
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[1].title).toBe('Page 2');
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(
      () => useExampleData({ id: '1' }),
      { wrapper: TestWrapper }
    );

    // Mock AbortController
    const mockAbort = jest.fn();
    global.AbortController = jest.fn().mockImplementation(() => ({
      abort: mockAbort,
      signal: {},
    }));

    unmount();

    // Verify cleanup occurred (specific implementation depends on hook)
  });
});

describe('Performance', () => {
  it('memoizes expensive computations', () => {
    const { rerender } = renderWithProviders(
      <ExampleComponent {...defaultProps} />
    );

    // Mock the transform function to track calls
    const transformData = require('@/lib/utils/example').transformData;
    transformData.mockClear();

    // Re-render with same props should not trigger transform again
    rerender(<ExampleComponent {...defaultProps} />);

    expect(transformData).not.toHaveBeenCalled();
  });

  it('handles rapid state changes efficiently', async () => {
    jest.useFakeTimers();

    const mockAction = jest.fn();
    renderWithProviders(
      <ExampleComponent {...defaultProps} onAction={mockAction} />
    );

    const button = screen.getByRole('button', { name: /perform action/i });

    // Rapid clicks
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Should handle gracefully without multiple calls
    expect(mockAction).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});