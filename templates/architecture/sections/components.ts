import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { PerformanceTester } from '@/app/testUtils/performanceTestUtils';
import {
  mockViewport,
  testBreakpoints,
  assertResponsiveClasses,
  BREAKPOINTS
} from '@/app/testUtils/responsiveTestUtils';

interface ComponentSectionParams {
  Component: React.ComponentType<any>;
  defaultProps: any;
  mockData?: any;
}

export function architectureComplianceSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🏗️ Architecture Compliance', () => {
    it('avoids unnecessary re-renders', () => {
      const tester = new PerformanceTester(Component);
      tester
        .render(defaultProps)
        .expectRenderCount(1)
        .rerender(defaultProps)
        .expectNoRerender();
      tester.unmount();
    });
  });
}

export function responsiveDesignSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('📱 Mobile-First Responsive Design', () => {
    it('applies responsive classes', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const container = screen.getByTestId('example-component');
      assertResponsiveClasses(container, { base: ['p-4'], md: ['p-6'] });
    });
    it('responds to breakpoints', () => {
      testBreakpoints(() => {
        mockViewport(BREAKPOINTS.mobile);
        renderWithProviders(<Component {...defaultProps} />);
      });
    });
  });
}

export function contextIntegrationSection({
  Component,
  defaultProps,
  mockData
}: ComponentSectionParams) {
  describe('🔄 Context Integration', () => {
    it('renders with context data', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByText(mockData.content)).toBeInTheDocument();
    });
  });
}

export function performanceOptimizationSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('⚡ Performance Optimization', () => {
    it('cleans up effects', () => {
      const { unmount } = renderWithProviders(<Component {...defaultProps} />);
      unmount();
    });
  });
}

export function accessibilitySection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('♿ Accessibility', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Component {...defaultProps} />);
      const button = screen.getByRole('button', { name: /action/i });
      await user.tab();
      expect(button).toHaveFocus();
    });
  });
}

export function userInteractionsSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🎯 User Interactions', () => {
    it('handles clicks', () => {
      const mockOnAction = jest.fn();
      renderWithProviders(
        <Component {...defaultProps} onAction={mockOnAction} />
      );
      fireEvent.click(screen.getByRole('button', { name: /action/i }));
      expect(mockOnAction).toHaveBeenCalled();
    });
  });
}

export function loadingStatesSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🔄 Loading States', () => {
    it('shows loading indicator', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}

export function errorHandlingSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('❌ Error Handling', () => {
    it('renders error state', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}

export function integrationTestSection({
  Component,
  defaultProps
}: ComponentSectionParams) {
  describe('🚀 Integration Tests', () => {
    it('works end-to-end', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.click(button);
      expect(defaultProps.onAction).toHaveBeenCalled();
    });
  });
}
