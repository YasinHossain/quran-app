import { fireEvent, render, screen } from '@testing-library/react';

import { CONTEXT_VIEW_STORAGE_KEY, VerseContextPanel } from '../VerseContextPanel';

const viewLabels = {
  group: 'Show verses as',
  translation: 'Translation',
  arabic: 'Arabic',
  both: 'Both',
};

const renderPanel = (labels: typeof viewLabels | null = viewLabels) =>
  render(
    <VerseContextPanel
      headingId="context-heading"
      heading="Read in context"
      listLabel="Context verses"
      {...(labels ? { viewLabels: labels } : {})}
    >
      <ol>
        <li aria-current="true">
          <p data-slot="context-arabic">ٱللَّهُ</p>
          <p data-slot="context-translation">Allah</p>
        </li>
      </ol>
    </VerseContextPanel>
  );

const panel = () => screen.getByRole('region', { name: 'Read in context' });

describe('VerseContextPanel', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows the translation by default and remembers the chosen view', () => {
    renderPanel();
    expect(panel()).toHaveAttribute('data-context-view', 'translation');

    fireEvent.click(screen.getByRole('radio', { name: 'Arabic' }));

    expect(screen.getByRole('radio', { name: 'Arabic' })).toHaveAttribute('aria-checked', 'true');
    expect(panel()).toHaveAttribute('data-context-view', 'arabic');
    expect(window.localStorage.getItem(CONTEXT_VIEW_STORAGE_KEY)).toBe('arabic');
  });

  it('restores a stored view and moves between options with arrow keys', () => {
    window.localStorage.setItem(CONTEXT_VIEW_STORAGE_KEY, 'both');
    renderPanel();
    expect(panel()).toHaveAttribute('data-context-view', 'both');

    fireEvent.keyDown(screen.getByRole('radio', { name: 'Both' }), { key: 'ArrowRight' });

    expect(panel()).toHaveAttribute('data-context-view', 'translation');
    expect(screen.getByRole('radio', { name: 'Translation' })).toHaveFocus();
  });

  it('still switches when storage is unavailable', () => {
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderPanel();

    fireEvent.click(screen.getByRole('radio', { name: 'Both' }));

    expect(panel()).toHaveAttribute('data-context-view', 'both');
    getItem.mockRestore();
    setItem.mockRestore();
  });

  it('has no switch when there is no translation (Arabic-only pages)', () => {
    renderPanel(null);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(panel()).toHaveAttribute('data-context-view', 'arabic');
    expect(screen.getByRole('region', { name: 'Context verses' })).toHaveAttribute('tabindex', '0');
  });
});
