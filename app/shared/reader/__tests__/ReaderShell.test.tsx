import { render } from '@testing-library/react';

import { ReaderShell } from '@/app/shared/reader/ReaderShell';

jest.mock('next/dynamic', () => {
  return () => () => null;
});

const mockUseReaderMode = jest.fn();
jest.mock('@/app/providers/ReaderModeContext', () => ({
  useReaderMode: () => mockUseReaderMode(),
}));

jest.mock('@/app/providers/UIStateContext', () => ({
  useUIState: () => ({ setSettingsOpen: jest.fn() }),
}));

jest.mock('@/app/(features)/surah/components/surah-view/SurahMain', () => ({
  SurahMain: () => null,
}));

jest.mock('@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation', () => ({
  SurahWorkspaceNavigation: () => null,
}));

jest.mock('@/app/shared/SurahListSidebar', () => ({
  SurahListSidebar: () => null,
}));

jest.mock('@/app/shared/reader/settings', () => ({
  SettingsSidebar: () => null,
}));

const settingsSidebarContentSpy = jest.fn();
jest.mock('@/app/shared/reader/settings/SettingsSidebarContent', () => ({
  SettingsSidebarContent: (props: unknown) => {
    settingsSidebarContentSpy(props);
    return null;
  },
}));

jest.mock('@/app/shared/reader/ReaderLayouts', () => ({
  WorkspaceReaderLayout: ({ desktopRight }: { desktopRight?: unknown }) => <>{desktopRight}</>,
}));

jest.mock('@/app/shared/reader/useReaderView', () => ({
  useReaderView: () => ({
    verseListing: {
      verses: [{ chapter_id: 1 }],
      activeVerse: null,
      reciter: null,
      isPlayerVisible: false,
      handleNext: jest.fn(),
      handlePrev: jest.fn(),
    },
    panels: {
      selectedTranslationName: '',
      selectedWordLanguageName: '',
      selectedMushafName: '',
      selectedMushafId: '',
      openTranslationPanel: jest.fn(),
      closeTranslationPanel: jest.fn(),
      isTranslationPanelOpen: false,
      openWordLanguagePanel: jest.fn(),
      closeWordLanguagePanel: jest.fn(),
      isWordLanguagePanelOpen: false,
      isMushafPanelOpen: false,
      openMushafPanel: jest.fn(),
      closeMushafPanel: jest.fn(),
      onMushafChange: jest.fn(),
      mushafOptions: [],
    },
    mushafParams: {},
  }),
}));

describe('ReaderShell reader-mode initialization', () => {
  it('enables reader mode in a layout effect to avoid refresh flash', () => {
    const enableReaderMode = jest.fn();
    mockUseReaderMode.mockReturnValue({
      mode: 'verse',
      setMode: jest.fn(),
      enableReaderMode,
      isReaderModeAvailable: false,
    });

    render(<ReaderShell resourceId="1" lookup={jest.fn()} initialMode="mushaf" />);

    expect(enableReaderMode).toHaveBeenCalledWith('mushaf');
  });

  it('renders reading-mode settings immediately when initialMode is mushaf', () => {
    settingsSidebarContentSpy.mockClear();

    mockUseReaderMode.mockReturnValue({
      mode: 'verse',
      setMode: jest.fn(),
      enableReaderMode: jest.fn(),
      isReaderModeAvailable: false,
    });

    render(<ReaderShell resourceId="1" lookup={jest.fn()} initialMode="mushaf" />);

    expect(settingsSidebarContentSpy).toHaveBeenCalled();
    const firstCallProps = settingsSidebarContentSpy.mock.calls[0]?.[0] as
      | { activeReaderMode?: string }
      | undefined;
    expect(firstCallProps?.activeReaderMode).toBe('reading');
  });
});
