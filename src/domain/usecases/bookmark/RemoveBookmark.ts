/**
 * Use Case: Remove Bookmark
 *
 * Handles the business logic for removing a bookmark from a folder.
 * Includes cleanup and validation.
 */

import { Folder } from '../../entities';
import { IBookmarkRepository } from '../../repositories';

export interface RemoveBookmarkRequest {
  verseId: string;
  folderId?: string; // If not provided, removes from any folder that contains it
}

export interface RemoveBookmarkResponse {
  success: boolean;
  folder?: Folder; // Updated folder after removal
  wasFound: boolean; // true if bookmark was found and removed
}

export class RemoveBookmark {
  constructor(private bookmarkRepository: IBookmarkRepository) {}

  async execute(request: RemoveBookmarkRequest): Promise<RemoveBookmarkResponse> {
    const { verseId, folderId } = request;

    if (folderId) {
      return this.removeFromSpecificFolder(verseId, folderId);
    } else {
      return this.removeFromAnyFolder(verseId);
    }
  }

  private async removeFromSpecificFolder(
    verseId: string,
    folderId: string
  ): Promise<RemoveBookmarkResponse> {
    // Get the specific folder
    const folder = await this.bookmarkRepository.getFolder(folderId);
    if (!folder) {
      throw new Error(`Folder not found: ${folderId}`);
    }

    // Check if the bookmark exists in this folder
    if (!folder.containsVerse(verseId)) {
      return {
        success: true,
        folder,
        wasFound: false,
      };
    }

    // Remove bookmark from folder
    const updatedFolder = folder.removeBookmark(verseId);

    // Save the updated folder
    await this.bookmarkRepository.saveFolder(updatedFolder);

    return {
      success: true,
      folder: updatedFolder,
      wasFound: true,
    };
  }

  private async removeFromAnyFolder(verseId: string): Promise<RemoveBookmarkResponse> {
    // Find which folder contains the bookmark
    const bookmarkLocation = await this.bookmarkRepository.findBookmarkFolder(verseId);

    if (!bookmarkLocation) {
      return {
        success: true,
        wasFound: false,
      };
    }

    // Remove bookmark from the found folder
    const updatedFolder = bookmarkLocation.folder.removeBookmark(verseId);

    // Save the updated folder
    await this.bookmarkRepository.saveFolder(updatedFolder);

    return {
      success: true,
      folder: updatedFolder,
      wasFound: true,
    };
  }
}
