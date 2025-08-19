/**
 * [COMPONENT_NAME] Component
 * 
 * [DESCRIPTION OF COMPONENT PURPOSE]
 * 
 * @designTokens [LIST_TOKENS_USED] (e.g., surface, foreground, accent)
 * @themeAware true
 * @accessibility WCAG AA compliant
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

// Variant definitions using design tokens
export const [COMPONENT_NAME]_VARIANTS = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-surface text-foreground hover:bg-interactive-hover',
  ghost: 'bg-transparent text-foreground hover:bg-interactive-hover',
} as const;

// Size definitions
export const [COMPONENT_NAME]_SIZES = {
  sm: 'text-sm p-2',
  md: 'text-base p-3',
  lg: 'text-lg p-4',
} as const;

// Props interface extending HTML attributes
export interface [COMPONENT_NAME]Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: keyof typeof [COMPONENT_NAME]_VARIANTS | string;
  
  /** Size variant */
  size?: keyof typeof [COMPONENT_NAME]_SIZES;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Children elements */
  children: React.ReactNode;
  
  /** Additional CSS classes for composition */
  className?: string;
}

// Component with forwardRef for DOM access
export const [COMPONENT_NAME] = React.forwardRef<HTMLDivElement, [COMPONENT_NAME]Props>(
  (
    { 
      variant = 'primary', 
      size = 'md', 
      isLoading = false,
      disabled = false,
      children, 
      className, 
      ...props 
    },
    ref
  ) => {
    // Resolve variant class
    const variantClass =
      variant in [COMPONENT_NAME]_VARIANTS
        ? [COMPONENT_NAME]_VARIANTS[variant as keyof typeof [COMPONENT_NAME]_VARIANTS]
        : variant;

    // Resolve size class
    const sizeClass = [COMPONENT_NAME]_SIZES[size] || [COMPONENT_NAME]_SIZES.md;

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles using design tokens
          'rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          
          // Variant styles
          variantClass,
          
          // Size styles
          sizeClass,
          
          // State styles
          {
            'opacity-50 pointer-events-none': disabled,
            'cursor-wait': isLoading,
          },
          
          // Composition
          className
        )}
        aria-disabled={disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="inline-flex items-center mr-2" aria-hidden="true">
            <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
          </div>
        )}
        {children}
      </div>
    );
  }
);

[COMPONENT_NAME].displayName = '[COMPONENT_NAME]';

// Export variants and sizes for external usage
export { [COMPONENT_NAME]_VARIANTS as variants, [COMPONENT_NAME]_SIZES as sizes };