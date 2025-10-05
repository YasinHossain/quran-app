import { screen } from '@testing-library/react';
import React from 'react';

import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

interface RoutingSectionParams<P> {
  Component: React.ComponentType<P>;
  defaultProps: P;
}

export function routingSection<P>({
  Component,
  defaultProps
}: RoutingSectionParams<P>): void {
  describe('🚦 Routing', () => {
    it('renders correct route', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}
