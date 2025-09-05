/**
 * MANDATORY Architecture-Compliant Test Template
 * 
 * This template MUST be followed exactly for ALL component tests.
 * Tests must include provider wrappers and architecture compliance validation.
 * 
 * Usage: Copy this template and replace ComponentName with your component name
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { validatePerformanceOptimization } from '@/app/testUtils/performanceTestUtils';
import { validateResponsiveDesign } from '@/app/testUtils/responsiveTestUtils';

import { ComponentName } from '../ComponentName';

import type { ComponentNameProps } from '../ComponentName';

import { AudioProvider } from '@/app/providers/AudioContext';

// ✅ REQUIRED: Mock external dependencies
jest.mock('@/lib/api/client', () => ({
  fetchData: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  transformData: jest.fn((data) => ({ ...data, processed: true })),
}));

// ✅ REQUIRED: Test wrapper with ALL necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);

// ✅ Test data setup
const mockData = {
  id: 'test-id',
  title: 'Test Component',
  subtitle: 'Test subtitle',
  items: [
    { id: 'item-1', content: 'Test item 1' },
    { id: 'item-2', content: 'Test item 2' },
  ],
};

const defaultProps: ComponentNameProps = {
  id: 'test-component',
  data: mockData,
  onAction: jest.fn(),
};

describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Architecture Compliance', () => {
    it('renders with memo() wrapper (no unnecessary re-renders)', () => {
      const { rerender } = render(
        <ComponentName {...defaultProps} />,
        { wrapper: TestWrapper }
      );

      const component = screen.getByTestId('component-test-component');
      expect(component).toBeInTheDocument();

      // Test memo() effectiveness - component shouldn't re-render with same props
      const renderCount = jest.fn();
      const MemoTestComponent = () => {
        renderCount();
        return <ComponentName {...defaultProps} />;
      };

      rerender(<MemoTestComponent />);
      rerender(<MemoTestComponent />);
      
      expect(renderCount).toHaveBeenCalledTimes(1);
    });

    it('implements mobile-first responsive design patterns', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      const container = screen.getByTestId('component-test-component');
      
      // Validate responsive classes
      validateResponsiveDesign(container, {
        mobileClasses: ['space-y-4', 'p-4'],
        desktopClasses: ['md:space-y-6', 'md:p-6'],
      });

      const layoutContainer = container.querySelector('.space-y-4.md\\:space-y-0.md\\:flex');
      expect(layoutContainer).toBeInTheDocument();
    });

    it('integrates with required context providers', () => {
      // Test without providers (should not crash but may have limited functionality)
      const { container } = render(<ComponentName {...defaultProps} />);
      expect(container).toBeInTheDocument();

      // Test with providers (full functionality)
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });
      
      // Verify context integration
      expect(screen.getByTestId('component-test-component')).toBeInTheDocument();
    });

    it('implements touch-friendly interactions (44px minimum)', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Verify minimum touch target size (44px = h-11 in Tailwind)
        expect(button).toHaveClass('h-11');
      });
    });

    it('validates performance optimizations', async () => {
      const mockOnAction = jest.fn();
      
      render(
        <ComponentName {...defaultProps} onAction={mockOnAction} />,
        { wrapper: TestWrapper }
      );

      // Test useCallback optimization - callbacks should be stable
      await validatePerformanceOptimization(screen.getByTestId('component-test-component'));
    });
  });

  describe('Functionality', () => {
    it('renders component data correctly', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      expect(screen.getByText('Test Component')).toBeInTheDocument();
      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
      expect(screen.getByText('Test item 1')).toBeInTheDocument();
      expect(screen.getByText('Test item 2')).toBeInTheDocument();
    });

    it('handles click interactions', async () => {
      const mockOnAction = jest.fn();
      
      render(
        <ComponentName {...defaultProps} onAction={mockOnAction} />,
        { wrapper: TestWrapper }
      );

      const actionButton = screen.getByRole('button', { name: /action for/i });
      
      await userEvent.click(actionButton);
      
      expect(mockOnAction).toHaveBeenCalledWith('test-component', 'click');
    });

    it('handles bookmark toggle', async () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      const bookmarkButton = screen.getByRole('button', { name: /toggle bookmark/i });
      
      // Initially not bookmarked
      expect(bookmarkButton).toHaveTextContent('☆');
      
      await userEvent.click(bookmarkButton);
      
      // Should be bookmarked after click (this depends on BookmarkContext implementation)
      await waitFor(() => {
        expect(bookmarkButton).toHaveTextContent('★');
      });
    });

    it('handles keyboard interactions', async () => {
      const mockOnAction = jest.fn();
      
      render(
        <ComponentName {...defaultProps} onAction={mockOnAction} />,
        { wrapper: TestWrapper }
      );

      const component = screen.getByTestId('component-test-component');
      
      // Focus component and press Enter
      component.focus();
      fireEvent.keyPress(component, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnAction).toHaveBeenCalledWith('test-component', 'click');
    });
  });

  describe('State Management', () => {
    it('updates when data changes', () => {
      const { rerender } = render(
        <ComponentName {...defaultProps} />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();

      const newData = { ...mockData, title: 'Updated Component' };
      rerender(
        <ComponentName {...defaultProps} data={newData} />
      );

      expect(screen.getByText('Updated Component')).toBeInTheDocument();
      expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
    });

    it('handles loading and error states', async () => {
      // Test loading state
      const loadingData = { ...mockData, isLoading: true };
      render(
        <ComponentName {...defaultProps} data={loadingData} />,
        { wrapper: TestWrapper }
      );

      // Verify loading indication (if implemented)
      // expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

      // Test error state
      const errorData = { ...mockData, error: 'Test error' };
      render(
        <ComponentName {...defaultProps} data={errorData} />,
        { wrapper: TestWrapper }
      );

      // Verify error handling (if implemented)
      // expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      const actionButton = screen.getByRole('button', { name: /action for test component/i });
      expect(actionButton).toHaveAttribute('aria-label');

      const bookmarkButton = screen.getByRole('button', { name: /toggle bookmark for test component/i });
      expect(bookmarkButton).toHaveAttribute('aria-label');
    });

    it('supports keyboard navigation', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
      });
    });

    it('has semantic HTML structure', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

      // Verify semantic elements are used appropriately
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data gracefully', () => {
      const emptyData = { ...mockData, items: [] };
      
      render(
        <ComponentName {...defaultProps} data={emptyData} />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
      // Should not crash with empty items
    });

    it('handles missing optional props', () => {
      const minimalProps = {
        id: 'minimal',
        data: mockData,
      };
      
      render(
        <ComponentName {...minimalProps} />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByTestId('component-minimal')).toBeInTheDocument();
    });

    it('handles custom className prop', () => {
      render(
        <ComponentName {...defaultProps} className="custom-test-class" />,
        { wrapper: TestWrapper }
      );

      const component = screen.getByTestId('component-test-component');
      expect(component).toHaveClass('custom-test-class');
    });
  });
});