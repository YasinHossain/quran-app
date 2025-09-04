import { BookmarkFolderClient } from './BookmarkFolderClient';

export default async function BookmarkFolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId: rawFolderId } = await params;
  const folderId = decodeURIComponent(rawFolderId);
  return <BookmarkFolderClient folderId={folderId} />;
}
