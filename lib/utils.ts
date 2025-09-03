import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes and tailwind-merge for proper class overrides.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
