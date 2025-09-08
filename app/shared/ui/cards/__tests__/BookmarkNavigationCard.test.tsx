import userEvent from '@testing-library/user-event';

import { BookmarkNavigationCard } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import type { MockProps } from '@/tests/mocks';

jest.mock('next/link', () => {
  return ({
    children,
    href,
    onClick,
    ...props
  }: MockProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { scroll?: boolean; href: string }
  >) => {
    const { scroll: _scroll, ...rest } = props;
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onClick?.(e);
        }}
        {...rest}
      >
        {children}
      </a>
    );
  };
});

const DummyIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg data-testid="icon" width={size} height={size} className={className} />
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

describe('BookmarkNavigationCard', () => {
  const content = {
    id: 'bookmarks',
    icon: DummyIcon,
    label: 'Bookmarks',
    description: 'All bookmarks',
  };

  it('calls onSectionChange when clicked', async () => {
    const handleSectionChange = jest.fn();
    renderWithProviders(
      <BookmarkNavigationCard content={content} onSectionChange={handleSectionChange} />
    );

    await userEvent.click(screen.getByText('Bookmarks'));
    expect(handleSectionChange).toHaveBeenCalledWith('bookmarks');
  });

  it('applies active styling', () => {
    const { container } = renderWithProviders(
      <BookmarkNavigationCard content={content} isActive />
    );

    expect(container.firstChild).toHaveClass('bg-accent');
  });
});
