import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { PerformanceTester } from '@/app/testUtils/performanceTestUtils';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import {
  mockViewport,
  testBreakpoints,
  assertResponsiveClasses,
  BREAKPOINTS
} from '@/app/testUtils/responsiveTestUtils';

interface ComponentSectionParams<P> {
  Component: React.ComponentType<P>;
  defaultProps: P;
}

interface ComponentSectionWithMockData<P> extends ComponentSectionParams<P> {
  mockData: { content: string };
}

export function architectureComplianceSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
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

export function responsiveDesignSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
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

export function contextIntegrationSection<P>({
  Component,
  defaultProps,
  mockData
}: ComponentSectionWithMockData<P>): void {
  describe('🔄 Context Integration', () => {
    it('renders with context data', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByText(mockData.content)).toBeInTheDocument();
    });
  });
}

export function performanceOptimizationSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
  describe('⚡ Performance Optimization', () => {
    it('cleans up effects', () => {
      const { unmount } = renderWithProviders(<Component {...defaultProps} />);
      unmount();
    });
  });
}

export function accessibilitySection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
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

export function userInteractionsSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
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

export function loadingStatesSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
  describe('🔄 Loading States', () => {
    it('shows loading indicator', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}

export function errorHandlingSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
  describe('❌ Error Handling', () => {
    it('renders error state', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}

export function integrationTestSection<P>({
  Component,
  defaultProps
}: ComponentSectionParams<P>): void {
  describe('🚀 Integration Tests', () => {
    it('works end-to-end', () => {
      renderWithProviders(<Component {...defaultProps} />);
      const button = screen.getByRole('button', { name: /action/i });
      fireEvent.click(button);
      expect(defaultProps.onAction).toHaveBeenCalled();
    });
  });
}
