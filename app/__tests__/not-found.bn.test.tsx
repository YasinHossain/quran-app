import { render, screen } from '@testing-library/react';

import { i18n } from '@/app/i18n';
import NotFound from '@/app/not-found';
import { TranslationProvider } from '@/app/providers/TranslationProvider';

import type { ReactNode } from 'react';

jest.mock('next/link', () => {
  return ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
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
