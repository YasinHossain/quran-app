import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SettingsProvider, useSettings } from '@/app/providers/SettingsContext';

const SettingsTest = (): React.ReactElement => {
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

const renderSettings = () =>
  render(
    <SettingsProvider>
      <SettingsTest />
    </SettingsProvider>
  );

const getStoredSettings = () => JSON.parse(localStorage.getItem('quranAppSettings') || '{}');

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

  const clickUpdate = () => userEvent.click(screen.getByRole('button', { name: 'Update' }));

  const expectStoredFontSize = (size: number) =>
    waitFor(() => expect(getStoredSettings().arabicFontSize).toBe(size));

  const expectRenderedFontSize = (size: number) =>
    waitFor(() =>
      expect(screen.getByTestId('settings').textContent).toBe(
        JSON.stringify({ ...defaultSettings, arabicFontSize: size })
      )
    );

  it('defaults to expected values', () => {
    renderSettings();
    expect(screen.getByTestId('settings').textContent).toBe(JSON.stringify(defaultSettings));
  });

  it('persists settings changes in localStorage across renders', async () => {
    const { unmount } = renderSettings();
    await clickUpdate();
    await expectStoredFontSize(30);
    unmount();
    renderSettings();
    await expectRenderedFontSize(30);
  });

  it('saves multiple tafsir selections', async () => {
    renderSettings();
    await userEvent.click(screen.getByRole('button', { name: 'Tafsirs' }));
    await waitFor(() => expect(getStoredSettings().tafsirIds).toEqual([1, 2, 3]));
  });
});
