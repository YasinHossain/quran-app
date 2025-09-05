import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { Header } from '@/app/shared/Header';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Returns the key itself for testing purposes
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
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

describe('Header', () => {
  it('renders the brand text', () => {
    renderWithProviders(
      <HeaderVisibilityProvider>
        <Header />
      </HeaderVisibilityProvider>
    );
    expect(screen.getByText('Quran Mazid')).toBeInTheDocument();
  });

  it('renders the search placeholder', () => {
    renderWithProviders(
      <HeaderVisibilityProvider>
        <Header />
      </HeaderVisibilityProvider>
    );
    expect(screen.getByPlaceholderText('Search verses, surahs...')).toBeInTheDocument();
  });

  it('aligns content vertically centered', () => {
    const { container } = renderWithProviders(
      <HeaderVisibilityProvider>
        <Header />
      </HeaderVisibilityProvider>
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('items-center');
  });
});
