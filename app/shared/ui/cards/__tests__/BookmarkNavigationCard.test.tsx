import userEvent from '@testing-library/user-event';

import { BookmarkNavigationCard } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import type { BookmarkNavigationContent } from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { MockProps } from '@/tests/mocks';

jest.mock('next/link', (): unknown => {
  return ({
    children,
    href,
    onClick,
    ...props
  }: MockProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { scroll?: boolean; href: string }
  >): React.JSX.Element => {
    const { ...rest } = props;
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

const DummyIcon = ({
  size = 16,
  className = '',
}: {
  size?: number;
  className?: string;
}): React.JSX.Element => (
  <svg data-testid="icon" width={size} height={size} className={className} />
);

beforeAll(() => {
  setMatchMedia(false);
});

describe('BookmarkNavigationCard', () => {
  const content: BookmarkNavigationContent = {
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
