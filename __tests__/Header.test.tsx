import { render, screen } from '@testing-library/react';
import Header from '@/app/components/common/Header';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { HeaderVisibilityProvider } from '@/app/context/HeaderVisibilityContext';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <HeaderVisibilityProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </HeaderVisibilityProvider>
  </ThemeProvider>
);

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
    render(
      <Wrapper>
        <Header />
      </Wrapper>
    );
    // The component uses t('title'), so we expect 'title' to be in the document.
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('renders the search placeholder', () => {
    render(
      <Wrapper>
        <Header />
      </Wrapper>
    );
    // The component uses t('search_placeholder'), so we check for that key.
    expect(screen.getByPlaceholderText('search_placeholder')).toBeInTheDocument();
  });
});
