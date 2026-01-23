import { render, screen } from '@testing-library/react';

import { HomeQuickLinks } from '@/app/(features)/home/components/HomeQuickLinks';

import type { MockProps } from '@/tests/mocks';

jest.mock('next/link', (): unknown => {
  return ({
    children,
    href,
    onClick,
    prefetch,
    ...props
  }: MockProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { scroll?: boolean; href: string }
  >): React.JSX.Element => {
    const { scroll, ...rest } = props;
    void scroll;
    void prefetch;
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

describe('HomeQuickLinks', () => {
  it('uses a wider maxWidth on desktop to avoid wrapping for longer translations', () => {
    render(<HomeQuickLinks />);

    const recentLink = screen.getByRole('link', { name: 'home_quicklink_recent' });
    const layout = recentLink.parentElement;
    const wrapper = layout?.parentElement as HTMLElement | null;

    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.style.maxWidth).toBe('clamp(18rem, 80vw, 64rem)');
    expect(wrapper).toHaveClass('px-2');
    expect(layout).toHaveClass('lg:grid-cols-4');
  });
});
