import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorHandler } from '@/src/infrastructure/errors';

import { ErrorBoundary } from '../ErrorBoundary';

jest.mock('@/src/infrastructure/errors', () => ({
  ErrorHandler: { handle: jest.fn() },
}));

function Boom() {
  throw new Error('boom');
}

const Fallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
  <div>
    Fallback
    <button onClick={resetError}>retry</button>
  </div>
);

describe('ErrorBoundary', () => {
  it('delegates errors to ErrorHandler', () => {
    render(
      <ErrorBoundary fallback={Fallback}>
        <Boom />
      </ErrorBoundary>
    );

    expect(ErrorHandler.handle).toHaveBeenCalled();
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });
});
