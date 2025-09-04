import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import JuzIndexPage from '@/app/(features)/juz/page';
import type { MockProps } from '@/tests/mocks';

jest.mock('next/link', () =>
  ({ href, children }: MockProps<{ href: string }>) => <a href={href}>{children}</a>
);

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

const renderPage = () => renderWithProviders(<JuzIndexPage />);

test('renders list of juz links', () => {
  renderPage();
  const link = screen.getByText('Juz 1').closest('a');
  expect(link).toHaveAttribute('href', '/juz/1');
});
