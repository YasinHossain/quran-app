import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LocalStorage } from '../storage/localStorage.js';

export const bookmarkTools: Tool[] = [
  {
    name: 'get_bookmarks',
    description: 'Get all bookmark folders and their contents',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'add_bookmark',
    description: 'Add a verse to bookmarks',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
        folderId: {
          type: 'string',
          description: 'Optional folder ID to add bookmark to (creates default folder if not specified)',
        },
      },
      required: ['verseKey'],
    },
  },
  {
    name: 'remove_bookmark',
    description: 'Remove a verse from bookmarks',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
        folderId: {
          type: 'string',
          description: 'Optional folder ID to remove bookmark from (removes from all folders if not specified)',
        },
      },
      required: ['verseKey'],
    },
  },
  {
    name: 'create_bookmark_folder',
    description: 'Create a new bookmark folder',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the new folder',
          minLength: 1,
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_bookmark_folder',
    description: 'Delete a bookmark folder and all its bookmarks',
    inputSchema: {
      type: 'object',
      properties: {
        folderId: {
          type: 'string',
          description: 'ID of the folder to delete',
        },
      },
      required: ['folderId'],
    },
  },
  {
    name: 'rename_bookmark_folder',
    description: 'Rename a bookmark folder',
    inputSchema: {
      type: 'object',
      properties: {
        folderId: {
          type: 'string',
          description: 'ID of the folder to rename',
        },
        newName: {
          type: 'string',
          description: 'New name for the folder',
          minLength: 1,
        },
      },
      required: ['folderId', 'newName'],
    },
  },
  {
    name: 'is_bookmarked',
    description: 'Check if a verse is bookmarked',
    inputSchema: {
      type: 'object',
      properties: {
        verseKey: {
          type: 'string',
          description: 'Verse key in format "chapter:verse" (e.g., "2:255")',
          pattern: '^\\d+:\\d+$',
        },
      },
      required: ['verseKey'],
    },
  },
];

export async function handleBookmarkTool(name: string, args: any): Promise<any> {
  switch (name) {
    case 'get_bookmarks':
      return LocalStorage.getBookmarks();

    case 'add_bookmark':
      const added = LocalStorage.addBookmark(args.verseKey, args.folderId);
      return { success: added, message: added ? 'Bookmark added successfully' : 'Failed to add bookmark' };

    case 'remove_bookmark':
      const removed = LocalStorage.removeBookmark(args.verseKey, args.folderId);
      return { success: removed, message: removed ? 'Bookmark removed successfully' : 'Bookmark not found' };

    case 'create_bookmark_folder':
      const folderId = LocalStorage.createFolder(args.name);
      return { 
        success: !!folderId, 
        folderId,
        message: folderId ? 'Folder created successfully' : 'Failed to create folder' 
      };

    case 'delete_bookmark_folder':
      const deleted = LocalStorage.deleteFolder(args.folderId);
      return { success: deleted, message: deleted ? 'Folder deleted successfully' : 'Folder not found' };

    case 'rename_bookmark_folder':
      const renamed = LocalStorage.renameFolder(args.folderId, args.newName);
      return { success: renamed, message: renamed ? 'Folder renamed successfully' : 'Folder not found' };

    case 'is_bookmarked':
      const isBookmarked = LocalStorage.isBookmarked(args.verseKey);
      return { bookmarked: isBookmarked };

    default:
      throw new Error(`Unknown bookmark tool: ${name}`);
  }
}