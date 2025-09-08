/**
 * MANDATORY Architecture-Compliant Test Template
 *
 * Usage: Copy this template and replace ComponentName with your component name.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { validateResponsiveDesign } from '@/app/testUtils/responsiveTestUtils';
import { TestWrapper } from '@/templates/ai-compliant/shared/test-wrapper';

import type { ComponentNameProps } from '@/templates/ai-compliant/ComponentName';

import { ComponentName } from '@/templates/ai-compliant/ComponentName';


jest.mock('@/lib/api/client', () => ({
  fetchData: jest.fn(),
}));

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

  it('renders and memoizes', () => {
    const { rerender } = render(<ComponentName {...defaultProps} />, {
      wrapper: TestWrapper,
    });

    const component = screen.getByTestId('component-test-component');
    expect(component).toBeInTheDocument();

    const renderCount = jest.fn();
    const MemoTest = () => {
      renderCount();
      return <ComponentName {...defaultProps} />;
    };

    rerender(<MemoTest />);
    rerender(<MemoTest />);
    expect(renderCount).toHaveBeenCalledTimes(1);
  });

  it('respects responsive design', () => {
    render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });
    const container = screen.getByTestId('component-test-component');

    validateResponsiveDesign(container, {
      mobileClasses: ['space-y-4', 'p-4'],
      desktopClasses: ['md:space-y-6', 'md:p-6'],
    });
  });

  it('integrates with providers', () => {
    render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });
    expect(screen.getByTestId('component-test-component')).toBeInTheDocument();
  });

  it('supports keyboard activation', () => {
    const mockOnAction = jest.fn();
    render(
      <ComponentName {...defaultProps} onAction={mockOnAction} />,
      { wrapper: TestWrapper },
    );

    const component = screen.getByTestId('component-test-component');
    component.focus();
    fireEvent.keyPress(component, { key: 'Enter', code: 'Enter' });
    expect(mockOnAction).toHaveBeenCalledWith('test-component', 'click');
  });

  it('is accessible', async () => {
    render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button');
    for (const button of buttons) {
      await user.tab();
      expect(button).toHaveClass('focus:outline-none');
    }
  });
});
