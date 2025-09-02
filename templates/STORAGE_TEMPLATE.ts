// Storage Template - Copy this pattern for persistent storage utilities
// Replace: example, ExampleSettings, EXAMPLE
// Location: app/providers/

import { ExampleSettings } from '@/types';

// Storage configuration
const STORAGE_KEY = 'quran-app-example-settings';
const STORAGE_VERSION = '1.0'; // For handling migrations

// Default settings - should match reducer's defaultSettings
export const defaultSettings: ExampleSettings = {
  theme: 'light',
  fontSize: 16,
  language: 'en',
  notifications: true,
  autoSave: true,
};

// Storage interface for different storage types
interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Default to localStorage, with fallback for SSR
const getStorageAdapter = (): StorageAdapter => {
  if (typeof window === 'undefined') {
    // SSR fallback - return dummy adapter
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  
  return window.localStorage;
};

/**
 * Load settings from storage with error handling and migration support.
 */
export function loadSettings(): ExampleSettings {
  const storage = getStorageAdapter();
  
  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...defaultSettings };
    }

    const parsed = JSON.parse(stored);
    
    // Handle version migrations
    const migratedSettings = migrateSettings(parsed);
    
    // Validate and merge with defaults to handle new settings
    const mergedSettings = {
      ...defaultSettings,
      ...migratedSettings,
    };
    
    // Validate settings values
    return validateSettings(mergedSettings);
    
  } catch (error) {
    console.warn('Failed to load settings from storage:', error);
    
    // Try to clear corrupted data
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.warn('Failed to clear corrupted settings:', clearError);
    }
    
    return { ...defaultSettings };
  }
}

/**
 * Save settings to storage with error handling.
 */
export function saveSettings(settings: ExampleSettings): void {
  const storage = getStorageAdapter();
  
  if (typeof window === 'undefined') return;
  
  try {
    // Add metadata for versioning and validation
    const dataToStore = {
      ...settings,
      _version: STORAGE_VERSION,
      _timestamp: Date.now(),
    };
    
    storage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.warn('Failed to save settings to storage:', error);
    
    // Could implement fallback strategies here:
    // - Try sessionStorage
    // - Send to server
    // - Show user notification
  }
}

/**
 * Clear all settings from storage.
 */
export function clearSettings(): void {
  const storage = getStorageAdapter();
  
  if (typeof window === 'undefined') return;
  
  try {
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear settings from storage:', error);
  }
}

/**
 * Export settings as JSON string for backup/sharing.
 */
export function exportSettings(settings: ExampleSettings): string {
  try {
    return JSON.stringify({
      settings,
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  } catch (error) {
    console.error('Failed to export settings:', error);
    throw new Error('Failed to export settings');
  }
}

/**
 * Import settings from JSON string with validation.
 */
export function importSettings(jsonString: string): ExampleSettings {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.settings) {
      throw new Error('Invalid settings format: missing settings object');
    }
    
    const migratedSettings = migrateSettings(parsed.settings);
    return validateSettings(migratedSettings);
    
  } catch (error) {
    console.error('Failed to import settings:', error);
    throw new Error('Invalid settings format');
  }
}

/**
 * Handle settings migrations between versions.
 */
function migrateSettings(settings: any): ExampleSettings {
  // Example migration logic
  if (!settings._version || settings._version < '1.0') {
    // Migrate from older version
    if (settings.oldThemeName) {
      settings.theme = settings.oldThemeName === 'dark' ? 'dark' : 'light';
      delete settings.oldThemeName;
    }
  }
  
  // Remove metadata fields
  delete settings._version;
  delete settings._timestamp;
  
  return settings;
}

/**
 * Validate settings values and provide defaults for invalid ones.
 */
function validateSettings(settings: any): ExampleSettings {
  const validated: ExampleSettings = { ...defaultSettings };
  
  // Validate theme
  if (['light', 'dark', 'auto'].includes(settings.theme)) {
    validated.theme = settings.theme;
  }
  
  // Validate fontSize
  if (typeof settings.fontSize === 'number' && 
      settings.fontSize >= 12 && 
      settings.fontSize <= 48) {
    validated.fontSize = settings.fontSize;
  }
  
  // Validate language
  if (typeof settings.language === 'string' && settings.language.length === 2) {
    validated.language = settings.language;
  }
  
  // Validate boolean settings
  if (typeof settings.notifications === 'boolean') {
    validated.notifications = settings.notifications;
  }
  
  if (typeof settings.autoSave === 'boolean') {
    validated.autoSave = settings.autoSave;
  }
  
  return validated;
}

/**
 * Check if storage is available and working.
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const storage = window.localStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information.
 */
export function getStorageUsage(): { used: number; available: number } | null {
  if (typeof window === 'undefined' || !isStorageAvailable()) {
    return null;
  }
  
  try {
    const storage = window.localStorage;
    let used = 0;
    
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        used += storage[key].length + key.length;
      }
    }
    
    // Rough estimate of localStorage limit (usually 5-10MB)
    const available = 10 * 1024 * 1024; // 10MB
    
    return { used, available };
  } catch {
    return null;
  }
}

// Constants for external use
export const STORAGE_CONSTANTS = {
  KEY: STORAGE_KEY,
  VERSION: STORAGE_VERSION,
} as const;