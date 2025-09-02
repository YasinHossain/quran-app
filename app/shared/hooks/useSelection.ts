/**
 * @fileoverview Selection hooks for managing single and multi-selection state
 * @module useSelection
 * @description Re-exports selection hooks for backward compatibility
 */

// Re-export hooks from separate files
export { useSelection } from './useSingleSelection';
export { useMultiSelection } from './useMultiSelection';

// Re-export types for convenience
export type { UseSelectionOptions, UseSelectionReturn } from './useSingleSelection';

export type { UseMultiSelectionOptions, UseMultiSelectionReturn } from './useMultiSelection';
