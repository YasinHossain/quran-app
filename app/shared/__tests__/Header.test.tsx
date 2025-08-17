import Header from '@/app/shared/Header';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';

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
  it('renders the title', () => {
    renderWithProviders(
      <HeaderVisibilityProvider>
        <Header />
      </HeaderVisibilityProvider>
    );
    // The component uses t('title'), so we expect 'title' to be in the document.
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('renders the search placeholder', () => {
    renderWithProviders(
      <HeaderVisibilityProvider>
        <Header />
      </HeaderVisibilityProvider>
    );
    // The component uses t('search_placeholder'), so we check for that key.
    expect(screen.getByPlaceholderText('search_placeholder')).toBeInTheDocument();
  });
});
