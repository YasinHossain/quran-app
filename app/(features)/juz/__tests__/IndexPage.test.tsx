import JuzIndexPage from '@/app/(features)/juz/page';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import type { MockProps } from '@/tests/mocks';

jest.mock('next/link', () => ({ href, children }: MockProps<{ href: string }>) => (
  <a href={href}>{children}</a>
));

beforeAll(() => {
  setMatchMedia(false);
});

const renderPage = (): void => {
  renderWithProviders(<JuzIndexPage />);
};

test('renders list of juz links', () => {
  renderPage();
  const link = screen.getByText('Juz 1').closest('a');
  expect(link).toHaveAttribute('href', '/juz/1');
});
