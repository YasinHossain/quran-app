import React from 'react';

import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync, screen, waitFor } from '@/app/testUtils/renderWithProviders';

import type { MockProps } from '@/tests/mocks';

jest.mock('next/link', () => ({ href, children }: MockProps<{ href: string }>) => (
  <a href={href}>{children}</a>
));
jest.mock('@/lib/api/server', () => ({
  getSurahNavigationListServer: async () => [
    {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      verses: 7,
      meaning: 'The Opening',
    },
  ],
}));

beforeAll(() => {
  setMatchMedia(false);
});

const renderPage = async (): Promise<void> => {
  const mod = await import('@/app/[lang]/(features)/tafsir/page');
  const PageComponent = await mod.default({ params: Promise.resolve({ lang: 'en' }) });
  await renderWithProvidersAsync(PageComponent);
};

test('renders list of tafsir links', async () => {
  await renderPage();
  await waitFor(() => {
    const link = screen.getByText('Al-Fatihah').closest('a');
    expect(link).toHaveAttribute('href', '/tafsir/al-fatihah/1');
  });
});
