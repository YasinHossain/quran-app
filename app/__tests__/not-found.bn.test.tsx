import { render, screen } from '@testing-library/react';

import NotFound from '@/app/not-found';
import { TranslationProvider } from '@/app/providers/TranslationProvider';

import type { ReactNode } from 'react';

const useTranslationMock = jest.requireMock('react-i18next').useTranslation as jest.Mock;

jest.mock('next/link', () => {
  return ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const BN_TRANSLATIONS = {
  page_not_found: 'পৃষ্ঠা পাওয়া যায়নি',
  home: 'বাড়ি',
} as const;

beforeEach(() => {
  useTranslationMock.mockImplementation(() => ({
    t: (key: string) => (BN_TRANSLATIONS as Record<string, string>)[key] ?? key,
  }));
});

afterEach(() => {
  useTranslationMock.mockReset();
});

describe('NotFound page in Bengali', () => {
  it('renders Bengali text', () => {
    render(
      <TranslationProvider initialLanguage="bn">
        <NotFound />
      </TranslationProvider>
    );
    expect(screen.getByText(BN_TRANSLATIONS.page_not_found)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: BN_TRANSLATIONS.home })).toHaveAttribute('href', '/');
  });
});
