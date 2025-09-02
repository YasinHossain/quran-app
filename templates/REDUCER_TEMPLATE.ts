// Reducer Template - Copy this pattern for context state management
// Replace: ExampleSettings, ExampleAction, example
// Location: app/providers/

import { ExampleSettings } from '@/types';

// Define all possible actions with discriminated union types
type ExampleAction =
  | { type: 'SET_SETTINGS'; value: ExampleSettings }
  | { type: 'UPDATE_SETTING'; key: keyof ExampleSettings; value: any }
  | { type: 'RESET_SETTINGS' }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_ERROR'; value: string | null }
  | { type: 'SET_ASYNC_RESULT'; value: any }
  | { type: 'BULK_UPDATE'; updates: Partial<ExampleSettings> };

// Extended state interface for complex contexts
interface ExampleState extends ExampleSettings {
  // Additional state properties
  isLoading?: boolean;
  error?: string | null;
  lastUpdated?: number;
  asyncResult?: any;
}

/**
 * Reducer for managing example settings and state.
 * 
 * Principles:
 * - Immutable updates only
 * - Type-safe action handling
 * - Comprehensive state transitions
 * - Error state management
 */
export function reducer(state: ExampleState, action: ExampleAction): ExampleState {
  switch (action.type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        ...action.value,
        lastUpdated: Date.now(),
        error: null,
      };
    
    case 'UPDATE_SETTING':
      return {
        ...state,
        [action.key]: action.value,
        lastUpdated: Date.now(),
        error: null,
      };
    
    case 'BULK_UPDATE':
      return {
        ...state,
        ...action.updates,
        lastUpdated: Date.now(),
        error: null,
      };
    
    case 'RESET_SETTINGS':
      return {
        ...defaultSettings,
        lastUpdated: Date.now(),
        error: null,
        isLoading: false,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.value,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.value,
        isLoading: false,
      };
    
    case 'SET_ASYNC_RESULT':
      return {
        ...state,
        asyncResult: action.value,
        isLoading: false,
        error: null,
      };
    
    default:
      // TypeScript exhaustive check - will cause compile error if action not handled
      const _exhaustiveCheck: never = action;
      console.warn('Unhandled action type:', _exhaustiveCheck);
      return state;
  }
}

// Default state
export const defaultSettings: ExampleSettings = {
  // Define your default settings here
  theme: 'light',
  fontSize: 16,
  language: 'en',
  notifications: true,
  autoSave: true,
};

// Initial state with additional properties
export const initialState: ExampleState = {
  ...defaultSettings,
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
  asyncResult: null,
};

// Action creators for type safety (optional but recommended)
export const actions = {
  setSettings: (value: ExampleSettings): ExampleAction => ({
    type: 'SET_SETTINGS',
    value,
  }),
  
  updateSetting: <K extends keyof ExampleSettings>(
    key: K,
    value: ExampleSettings[K]
  ): ExampleAction => ({
    type: 'UPDATE_SETTING',
    key,
    value,
  }),
  
  bulkUpdate: (updates: Partial<ExampleSettings>): ExampleAction => ({
    type: 'BULK_UPDATE',
    updates,
  }),
  
  resetSettings: (): ExampleAction => ({
    type: 'RESET_SETTINGS',
  }),
  
  setLoading: (value: boolean): ExampleAction => ({
    type: 'SET_LOADING',
    value,
  }),
  
  setError: (value: string | null): ExampleAction => ({
    type: 'SET_ERROR',
    value,
  }),
  
  setAsyncResult: (value: any): ExampleAction => ({
    type: 'SET_ASYNC_RESULT',
    value,
  }),
} as const;

// Type guards for action type checking (useful for middleware/debugging)
export const isSettingsAction = (action: ExampleAction): boolean => {
  return [
    'SET_SETTINGS',
    'UPDATE_SETTING',
    'BULK_UPDATE',
    'RESET_SETTINGS',
  ].includes(action.type);
};

export const isAsyncAction = (action: ExampleAction): boolean => {
  return [
    'SET_LOADING',
    'SET_ERROR',
    'SET_ASYNC_RESULT',
  ].includes(action.type);
};

export default reducer;