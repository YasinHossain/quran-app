import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingError from '@/app/shared/LoadingError';

it('shows loading fallback when loading', () => {
  render(
    <LoadingError isLoading error={null} loadingFallback={<div>loading</div>}>
      <div>content</div>
    </LoadingError>
  );
  expect(screen.getByText('loading')).toBeInTheDocument();
});

it('shows error fallback when error is present', () => {
  render(
    <LoadingError isLoading={false} error={'error'} errorFallback={<div>error</div>}>
      <div>content</div>
    </LoadingError>
  );
  expect(screen.getByText('error')).toBeInTheDocument();
});

it('renders children when not loading and no error', () => {
  render(
    <LoadingError isLoading={false}>
      <div>content</div>
    </LoadingError>
  );
  expect(screen.getByText('content')).toBeInTheDocument();
});
