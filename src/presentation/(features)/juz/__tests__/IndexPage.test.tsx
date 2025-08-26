import { renderWithProviders, screen } from '@/presentation/testUtils/renderWithProviders';
import JuzIndexPage from '@/presentation/(features)/juz/page';

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

const renderPage = () => renderWithProviders(<JuzIndexPage />);

test('renders list of juz links', () => {
  renderPage();
  const link = screen.getByText('Juz 1').closest('a');
  expect(link).toHaveAttribute('href', '/juz/1');
});
