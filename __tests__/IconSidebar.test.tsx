import { render, screen } from '@testing-library/react';
import IconSidebar from '@/app/components/common/IconSidebar';
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

    const homeBtn = screen.getByRole('button', { name: 'home' });
    expect(homeBtn).toBeInTheDocument();
    expect(homeBtn.closest('a')).toHaveAttribute('href', '/');

    const surahBtn = screen.getByRole('button', { name: 'all_surahs' });
    expect(surahBtn).toBeInTheDocument();
    expect(surahBtn.closest('a')).toHaveAttribute('href', '/features/surah/1');

    const bookmarksBtn = screen.getByRole('button', { name: 'bookmarks' });
    expect(bookmarksBtn).toBeInTheDocument();
    expect(bookmarksBtn.closest('a')).toHaveAttribute('href', '/features/bookmarks');
  });
});
