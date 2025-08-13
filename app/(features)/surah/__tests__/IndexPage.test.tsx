import { render, screen } from '@testing-library/react';
import SurahIndexPage from '@/app/(features)/surah/page';
import ClientProviders from '@/app/providers/ClientProviders';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

jest.mock('next/link', () => ({ href, children }: any) => <a href={href}>{children}</a>);

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

const renderPage = () =>
  render(
    <AudioProvider>
      <ClientProviders initialTheme="light">
        <SurahIndexPage />
      </ClientProviders>
    </AudioProvider>
  );

test('renders list of surah links', () => {
  renderPage();
  const link = screen.getByText('Al-Fatihah').closest('a');
  expect(link).toHaveAttribute('href', '/surah/1');
});
