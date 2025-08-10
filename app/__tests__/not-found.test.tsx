import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import NotFound from '@/app/not-found';
import TranslationProvider from '@/app/providers/TranslationProvider';

// Mock next/link for testing environment
jest.mock('next/link', () => {
  return ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('NotFound page', () => {
  it('renders translated text', () => {
    render(
      <TranslationProvider>
        <NotFound />
      </TranslationProvider>
    );
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });
});
