import { render, screen } from '@testing-library/react';

import NotFound from '@/app/not-found';
import { TranslationProvider } from '@/app/providers/TranslationProvider';

import type { ReactNode } from 'react';

const useTranslationMock = jest.requireMock('react-i18next').useTranslation as jest.Mock;

// Mock next/link for testing environment
jest.mock('next/link', () => {
  return ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

beforeEach(() => {
  useTranslationMock.mockImplementation(() => ({
    t: (key: string) => ({ page_not_found: 'Page not found', home: 'Home' })[key] ?? key,
  }));
});

afterEach(() => {
  useTranslationMock.mockReset();
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
