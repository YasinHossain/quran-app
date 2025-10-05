import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider, useTheme } from '@/app/providers/ThemeContext';
import { setMatchMedia } from '@/app/testUtils/matchMedia';

const ThemeTest = (): React.ReactElement => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle</button>
    </div>
  );
};

describe.skip('ThemeContext', () => {
  beforeAll(() => {
    setMatchMedia(false);
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('useTheme throws when rendered without ThemeProvider', () => {
    expect(() => render(<ThemeTest />)).toThrow('useTheme must be used within ThemeProvider');
  });

  it('sets and updates theme with persistence', async () => {
    render(
      <ThemeProvider>
        <ThemeTest />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
    });

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});
