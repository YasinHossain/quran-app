import { render, screen } from '@testing-library/react';
import SurahIndexPage from '@/app/(features)/surah/page';
import ClientProviders from '@/app/providers/ClientProviders';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

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
  const ui = await SurahIndexPage();
  render(
    <AudioProvider>
      <ClientProviders initialTheme="light">{ui}</ClientProviders>
    </AudioProvider>
  );
};

test('renders list of surah links', async () => {
  await renderPage();
  const link = screen.getByText('Al-Fatihah').closest('a');
  expect(link).toHaveAttribute('href', '/surah/1');
});
