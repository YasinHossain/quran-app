import userEvent from '@testing-library/user-event';

import { StandardNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

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

describe('StandardNavigationCard', () => {
  const content = {
    id: 1,
    title: 'Al-Fatihah',
    subtitle: 'The Opening',
  };

  it('calls onNavigate when clicked', async () => {
    const handleNavigate = jest.fn();
    renderWithProviders(<StandardNavigationCard content={content} onNavigate={handleNavigate} />);

    await userEvent.click(screen.getByText('Al-Fatihah'));
    expect(handleNavigate).toHaveBeenCalledWith(1);
  });

  it('applies active styling', () => {
    const { container } = renderWithProviders(
      <StandardNavigationCard content={content} isActive />
    );

    expect(container.firstChild).toHaveClass('bg-accent');
  });
});
