import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SettingsProvider, useSettings } from '@/app/providers/SettingsContext';

const SettingsTest = () => {
  const { settings, setSettings } = useSettings();
  return (
    <div>
      <div data-testid="settings">{JSON.stringify(settings)}</div>
      <button
        onClick={() => setSettings({ ...settings, arabicFontSize: settings.arabicFontSize + 2 })}
      >
        Update
      </button>
      <button onClick={() => setSettings({ ...settings, tafsirIds: [1, 2, 3] })}>Tafsirs</button>
    </div>
  );
};

describe('SettingsContext settings state', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const defaultSettings = {
    translationId: 20,
    translationIds: [20],
    tafsirIds: [169],
    arabicFontSize: 28,
    translationFontSize: 16,
    tafsirFontSize: 16,
    arabicFontFace: '"KFGQPC-Uthman-Taha", serif',
    wordLang: 'en',
    wordTranslationId: 85,
    showByWords: false,
    tajweed: false,
  };

  it('defaults to expected values', () => {
    render(
      <SettingsProvider>
        <SettingsTest />
      </SettingsProvider>
    );
    expect(screen.getByTestId('settings').textContent).toBe(JSON.stringify(defaultSettings));
  });

  it('persists settings changes in localStorage across renders', async () => {
    const { unmount } = render(
      <SettingsProvider>
        <SettingsTest />
      </SettingsProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Update' }));
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('quranAppSettings') || '{}').arabicFontSize).toBe(30);
    });
    unmount();

    render(
      <SettingsProvider>
        <SettingsTest />
      </SettingsProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('settings').textContent).toBe(
        JSON.stringify({ ...defaultSettings, arabicFontSize: 30 })
      );
    });
  });

  it('saves multiple tafsir selections', async () => {
    render(
      <SettingsProvider>
        <SettingsTest />
      </SettingsProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tafsirs' }));
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('quranAppSettings') || '{}').tafsirIds).toEqual([
        1, 2, 3,
      ]);
    });
  });
});
