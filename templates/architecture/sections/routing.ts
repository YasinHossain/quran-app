import { screen } from '@testing-library/react';
import React from 'react';

import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

interface RoutingSectionParams {
  Component: React.ComponentType<any>;
  defaultProps: any;
}

export function routingSection({
  Component,
  defaultProps
}: RoutingSectionParams) {
  describe('🚦 Routing', () => {
    it('renders correct route', () => {
      renderWithProviders(<Component {...defaultProps} />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });
  });
}
