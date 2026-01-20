import { render, screen, waitFor, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SettingsProvider, useSettings } from '@/app/providers/SettingsContext';
import { defaultSettings } from '@/app/providers/settingsStorage';

import type { Settings } from '@/types';

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

const renderSettings = (): RenderResult =>
  render(
    <SettingsProvider>
      <SettingsTest />
    </SettingsProvider>
  );

const getStoredSettings = (): Partial<Settings> =>
  JSON.parse(localStorage.getItem('quranAppSettings') || '{}');

describe('SettingsContext settings state', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const baseDefaultSettings = defaultSettings;

  const clickUpdate = async (): Promise<void> =>
    userEvent.click(screen.getByRole('button', { name: 'Update' }));

  const expectStoredFontSize = (size: number): Promise<void> =>
    waitFor(() => expect(getStoredSettings().arabicFontSize).toBe(size));

  const expectRenderedFontSize = (size: number): Promise<void> =>
    waitFor(() =>
      expect(screen.getByTestId('settings').textContent).toBe(
        JSON.stringify({ ...baseDefaultSettings, arabicFontSize: size })
      )
    );

  it('defaults to expected values', () => {
    renderSettings();
    expect(screen.getByTestId('settings').textContent).toBe(JSON.stringify(baseDefaultSettings));
  });

  it('persists settings changes in localStorage across renders', async () => {
    const { unmount } = renderSettings();
    await clickUpdate();
    await expectStoredFontSize(36);
    unmount();
    renderSettings();
    await expectRenderedFontSize(36);
  });

  it('saves multiple tafsir selections', async () => {
    renderSettings();
    await userEvent.click(screen.getByRole('button', { name: 'Tafsirs' }));
    await waitFor(() => expect(getStoredSettings().tafsirIds).toEqual([1, 2, 3]));
  });
});
