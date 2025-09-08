import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for conflicting utilities
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
