import { renderWithProviders, screen, waitFor } from '@/presentation/testUtils/renderWithProviders';
import TafsirIndexPage from '@/presentation/(features)/tafsir/page';
import React from 'react';

jest.mock('next/link', () => ({ href, children }: any) => <a href={href}>{children}</a>);
jest.mock('@/lib/api', () => ({
  getSurahList: jest.fn().mockResolvedValue([
    {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      verses: 7,
      meaning: 'The Opening',
    },
  ]),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

const renderPage = async () => {
  const PageComponent = await TafsirIndexPage();
  return renderWithProviders(PageComponent);
};

test('renders list of tafsir links', async () => {
  await renderPage();
  await waitFor(() => {
    const link = screen.getByText('Al-Fatihah').closest('a');
    expect(link).toHaveAttribute('href', '/tafsir/1');
  });
});
