/**
 * Use Case: Create Folder
 * 
 * Handles the business logic for creating a new bookmark folder.
 * Includes name validation and customization options.
 */

import { Folder, FolderCustomization } from '../../entities';
import { IBookmarkRepository } from '../../repositories';

export interface CreateFolderRequest {
  name: string;
  customization?: FolderCustomization;
}

export interface CreateFolderResponse {
  folder: Folder;
  wasCreated: boolean; // false if folder with same name already exists
}

export class CreateFolder {
  constructor(private bookmarkRepository: IBookmarkRepository) {}

  async execute(request: CreateFolderRequest): Promise<CreateFolderResponse> {
    const { name, customization } = request;

    // Validate folder name
    if (!Folder.isValidName(name)) {
      throw new Error('Invalid folder name: must be 1-100 characters and not empty');
    }

    // Check if folder with same name already exists
    const existingFolders = await this.bookmarkRepository.getFolders();
    const duplicateName = existingFolders.find(f => 
      f.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicateName) {
      return {
        folder: duplicateName,
        wasCreated: false
      };
    }

    // Create new folder with default or provided customization
    const folderCustomization: FolderCustomization = {
      color: '#7C3AED',
      icon: 'folder',
      ...customization
    };

    const newFolder = Folder.create(name, folderCustomization);

    // Save the folder
    await this.bookmarkRepository.saveFolder(newFolder);

    return {
      folder: newFolder,
      wasCreated: true
    };
  }

  /**
   * Suggest folder colors based on existing folders
   */
  async suggestColors(): Promise<string[]> {
    const existingFolders = await this.bookmarkRepository.getFolders();
    const usedColors = new Set(existingFolders.map(f => f.getColor()));
    
    const availableColors = [
      '#7C3AED', // Purple
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#3B82F6', // Blue
      '#EC4899', // Pink
      '#8B5CF6', // Violet
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316', // Orange
    ];

    return availableColors.filter(color => !usedColors.has(color));
  }

  /**
   * Suggest folder icons based on common use cases
   */
  suggestIcons(): string[] {
    return [
      'bookmark',
      'heart',
      'star',
      'book',
      'academic-cap',
      'light-bulb',
      'collection',
      'document-text',
      'flag',
      'tag'
    ];
  }

  /**
   * Validate folder customization
   */
  validateCustomization(customization: FolderCustomization): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    if (customization.color && !this.isValidColor(customization.color)) {
      errors.push('Invalid color format');
    }

    if (customization.description && customization.description.length > 500) {
      errors.push('Description must be 500 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidColor(color: string): boolean {
    // Simple validation for hex colors and CSS color names
    return /^#[0-9A-Fa-f]{6}$/.test(color) || 
           /^[a-zA-Z]+$/.test(color);
  }
}