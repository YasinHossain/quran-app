import { render, act } from '@testing-library/react';
import React from 'react';

import { BookmarkProvider, useBookmarks } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import * as api from '@/lib/api';
import * as chaptersApi from '@/lib/api/chapters';

jest.mock('@/lib/api/chapters');
jest.mock('@/lib/api');

beforeEach(() => {
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([]);
  (api.getChapters as jest.Mock).mockResolvedValue([]);
  (api.getSurahList as jest.Mock).mockResolvedValue([]);
});

export const renderWithProviders = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <SettingsProvider>
      <BookmarkProvider>{ui}</BookmarkProvider>
    </SettingsProvider>
  );

export const renderWithProvidersAsync = async (
  ui: React.ReactElement
): Promise<ReturnType<typeof renderWithProviders>> => {
  let result: ReturnType<typeof renderWithProviders> | undefined;
  await act(async () => {
    result = renderWithProviders(ui);
  });
  return result!;
};

type BookmarkContextValue = ReturnType<typeof useBookmarks>;

interface ButtonConfig {
  label: string;
  onClick: () => void;
}

interface InfoItem {
  id: string;
  value: unknown;
}

const createFolderHandler =
  <T,>(folder: T | undefined, handler: (value: T) => void): (() => void) =>
  () => {
    if (!folder) return;
    handler(folder);
  };

const buildInfoItems = ({
  folders,
  pinnedVerses,
  lastRead,
  isBookmarked,
  isPinned,
}: BookmarkContextValue): InfoItem[] => [
  { id: 'folders', value: folders },
  { id: 'pinned', value: pinnedVerses },
  { id: 'lastRead', value: lastRead },
  { id: 'is-bookmarked-1:1', value: isBookmarked('1:1') ? 'true' : 'false' },
  { id: 'is-pinned-1:1', value: isPinned('1:1') ? 'true' : 'false' },
];

const buildButtonConfigs = (context: BookmarkContextValue): ButtonConfig[] => {
  const {
    folders,
    createFolder,
    addBookmark,
    removeBookmark,
    renameFolder,
    deleteFolder,
    togglePinned,
    setLastRead,
  } = context;

  const firstFolder = folders[0];

  return [
    { label: 'Create Folder', onClick: () => createFolder('Test Folder') },
    { label: 'Add Bookmark', onClick: () => addBookmark('1:1', firstFolder?.id) },
    {
      label: 'Remove Bookmark',
      onClick: createFolderHandler(firstFolder, (folder) => removeBookmark('1:1', folder.id)),
    },
    {
      label: 'Rename Folder',
      onClick: createFolderHandler(firstFolder, (folder) => renameFolder(folder.id, 'New Name')),
    },
    {
      label: 'Set Color',
      onClick: createFolderHandler(firstFolder, (folder) =>
        renameFolder(folder.id, folder.name, 'text-primary')
      ),
    },
    {
      label: 'Delete Folder',
      onClick: createFolderHandler(firstFolder, (folder) => deleteFolder(folder.id)),
    },
    { label: 'Toggle Pin', onClick: () => togglePinned('1:1') },
    { label: 'Set Last Read', onClick: () => setLastRead('1', 1, '1:1', 1) },
  ];
};

const InfoRow = ({ id, value }: InfoItem): React.JSX.Element => (
  <div data-testid={id}>{typeof value === 'string' ? value : JSON.stringify(value)}</div>
);

const BookmarkTestView = ({
  infoItems,
  buttonConfigs,
}: {
  infoItems: InfoItem[];
  buttonConfigs: ButtonConfig[];
}): React.JSX.Element => (
  <div>
    {infoItems.map((item) => (
      <InfoRow key={item.id} id={item.id} value={item.value} />
    ))}
    {buttonConfigs.map(({ label, onClick }) => (
      <button key={label} onClick={onClick}>
        {label}
      </button>
    ))}
  </div>
);

export const BookmarkTestComponent = (): React.JSX.Element => {
  const context = useBookmarks();
  const infoItems = buildInfoItems(context);
  const buttonConfigs = buildButtonConfigs(context);

  return <BookmarkTestView infoItems={infoItems} buttonConfigs={buttonConfigs} />;
};
