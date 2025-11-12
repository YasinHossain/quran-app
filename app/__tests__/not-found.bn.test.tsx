import { render, screen } from '@testing-library/react';

import { i18n } from '@/app/i18n';
import NotFound from '@/app/not-found';
import { TranslationProvider } from '@/app/providers/TranslationProvider';

import type { ReactNode } from 'react';

const useTranslationMock = jest.requireMock('react-i18next').useTranslation as jest.Mock;

jest.mock('next/link', () => {
  return ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

beforeEach(() => {
  useTranslationMock.mockImplementation(() => ({
    t: (key: string) =>
      (i18n.language === 'bn'
        ? { page_not_found: 'পৃষ্ঠা পাওয়া যায় নি', home: 'বাড়ি' }
        : { page_not_found: 'Page not found', home: 'Home' })[key] ?? key,
  }));
});

afterEach(() => {
  useTranslationMock.mockReset();
});

describe('NotFound page in Bengali', () => {
  it('renders Bengali text', async () => {
    await i18n.changeLanguage('bn');
    render(
      <TranslationProvider>
        <NotFound />
      </TranslationProvider>
    );
    expect(screen.getByText('পৃষ্ঠা পাওয়া যায় নি')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'বাড়ি' })).toHaveAttribute('href', '/');
  });
});
