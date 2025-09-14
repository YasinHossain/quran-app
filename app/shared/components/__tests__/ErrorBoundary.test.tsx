import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorBoundary } from '@/app/shared/components/error-boundary';
import { ErrorHandler } from '@/src/infrastructure/errors';

jest.mock('@/src/infrastructure/errors', () => ({
  ErrorHandler: { handle: jest.fn() },
}));

function Boom(): never {
  throw new Error('boom');
}

const Fallback = ({ resetError }: { resetError: () => void }): React.ReactElement => (
  <div>
    Fallback
    <button onClick={resetError}>retry</button>
  </div>
);

describe('ErrorBoundary', () => {
  it('delegates errors to ErrorHandler', () => {
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <ErrorBoundary fallback={Fallback}>
        <Boom />
      </ErrorBoundary>
    );

    expect(ErrorHandler.handle).toHaveBeenCalled();
    expect(screen.getByText('Fallback')).toBeInTheDocument();

    console.error = originalError;
  });
});
