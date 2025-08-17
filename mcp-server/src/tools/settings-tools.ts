import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LocalStorage } from '../storage/localStorage.js';

export const settingsTools: Tool[] = [
  {
    name: 'get_user_settings',
    description: 'Get current user settings and preferences',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'update_user_settings',
    description: 'Update user settings and preferences',
    inputSchema: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'system'],
          description: 'UI theme preference',
        },
        language: {
          type: 'string',
          description: 'Interface language code (e.g., "en", "ar")',
        },
        fontSize: {
          type: 'number',
          minimum: 12,
          maximum: 32,
          description: 'Font size for reading',
        },
        arabicFont: {
          type: 'string',
          description: 'Arabic font family name',
        },
        translations: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of selected translation IDs',
        },
        tafsirs: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of selected tafsir IDs',
        },
        audioReciter: {
          type: 'number',
          description: 'Selected audio reciter ID',
        },
        autoplay: {
          type: 'boolean',
          description: 'Whether to autoplay audio',
        },
        repeatMode: {
          type: 'string',
          enum: ['off', 'verse', 'surah'],
          description: 'Audio repeat mode',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_arabic_fonts',
    description: 'Get available Arabic font options',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'reset_settings',
    description: 'Reset user settings to default values',
    inputSchema: {
      type: 'object',
      properties: {
        confirm: {
          type: 'boolean',
          description: 'Confirmation that settings should be reset',
        },
      },
      required: ['confirm'],
    },
  },
];

// Available Arabic fonts (matching the app)
const arabicFonts = [
  { name: 'Uthmani', value: 'KFGQPC-Uthman-Taha', category: 'Traditional' },
  { name: 'Uthmani Bold', value: 'KFGQPC-Uthman-Taha-Bold', category: 'Traditional' },
  { name: 'Noto Naskh Arabic', value: 'Noto-Naskh-Arabic', category: 'Modern' },
  { name: 'Amiri', value: 'Amiri', category: 'Modern' },
  { name: 'Scheherazade New', value: 'Scheherazade-New', category: 'Modern' },
  { name: 'Lateef', value: 'Lateef', category: 'Modern' },
  { name: 'Noor e Hira', value: 'Noor-e-Hira', category: 'Urdu' },
  { name: 'Noto Nastaliq Urdu', value: 'Noto Nastaliq Urdu', category: 'Urdu' },
];

export async function handleSettingsTool(name: string, args: any): Promise<any> {
  switch (name) {
    case 'get_user_settings':
      return LocalStorage.getSettings();

    case 'update_user_settings':
      const currentSettings = LocalStorage.getSettings();
      const updatedSettings = { ...currentSettings, ...args };
      const saved = LocalStorage.saveSettings(updatedSettings);
      return {
        success: saved,
        settings: saved ? updatedSettings : currentSettings,
        message: saved ? 'Settings updated successfully' : 'Failed to update settings',
      };

    case 'get_arabic_fonts':
      return { fonts: arabicFonts };

    case 'reset_settings':
      if (!args.confirm) {
        return {
          success: false,
          message: 'Settings reset requires confirmation',
        };
      }

      const defaultSettings = {
        theme: 'system' as const,
        language: 'en',
        fontSize: 16,
        arabicFont: 'KFGQPC-Uthman-Taha',
        translations: [20],
        tafsirs: [169],
        audioReciter: 7,
        autoplay: false,
        repeatMode: 'off' as const,
      };

      const resetSuccess = LocalStorage.saveSettings(defaultSettings);
      return {
        success: resetSuccess,
        settings: defaultSettings,
        message: resetSuccess ? 'Settings reset to defaults' : 'Failed to reset settings',
      };

    default:
      throw new Error(`Unknown settings tool: ${name}`);
  }
}
