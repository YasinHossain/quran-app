import { render, screen } from '@testing-library/react';
import IconSidebar from '@/app/components/shared/IconSidebar';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SidebarProvider>{children}</SidebarProvider>
  </ThemeProvider>
);

// mock translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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

describe('IconSidebar', () => {
  it('renders navigation buttons with correct hrefs', () => {
    render(
      <Wrapper>
        <IconSidebar />
      </Wrapper>
    );

    const homeLink = screen.getByRole('link', { name: 'home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const surahLink = screen.getByRole('link', { name: 'all_surahs' });
    expect(surahLink).toBeInTheDocument();
    expect(surahLink).toHaveAttribute('href', '/features/surah/1');

    const bookmarksLink = screen.getByRole('link', { name: 'bookmarks' });
    expect(bookmarksLink).toBeInTheDocument();
    expect(bookmarksLink).toHaveAttribute('href', '/features/bookmarks');
  });
});
