import { render, screen } from '@testing-library/react';
import JuzIndexPage from '@/app/(features)/juz/page';
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
        <JuzIndexPage />
      </ClientProviders>
    </AudioProvider>
  );

test('renders list of juz links', () => {
  renderPage();
  const link = screen.getByText('Juz 1').closest('a');
  expect(link).toHaveAttribute('href', '/juz/1');
});
