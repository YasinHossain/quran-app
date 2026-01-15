'use client';

import React, { memo, useId } from 'react';

import { cn } from '@/lib/utils/cn';

export interface UnifiedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  rightSlot?: React.ReactNode;
  variant?: 'default' | 'compact';
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const UnifiedInput = memo(function UnifiedInput({
  id,
  label,
  helperText,
  errorMessage,
  rightSlot,
  variant = 'default',
  wrapperClassName,
  inputClassName,
  labelClassName,
  className,
  ...props
}: UnifiedInputProps): React.JSX.Element {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const hasError = Boolean(errorMessage);
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const describedBy = hasError ? errorId : helperText ? helperId : props['aria-describedby'];

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className={cn('block text-sm font-semibold text-foreground', labelClassName)}
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'relative flex items-center gap-2 rounded-lg border bg-interactive/60 text-foreground',
          variant === 'compact' ? 'pl-4 pr-3 py-3' : 'px-4 py-3',
          hasError
            ? 'border-error focus-within:border-error focus-within:ring-2 focus-within:ring-error/20'
            : 'border-border focus-within:border-transparent focus-within:ring-2 focus-within:ring-accent',
          'transition-colors duration-150',
          wrapperClassName
        )}
      >
        <input
          id={inputId}
          className={cn(
            'flex-1 min-w-0 bg-surface/0 text-foreground placeholder:text-muted focus:outline-none',
            rightSlot ? 'pr-10' : undefined,
            inputClassName
          )}
          aria-invalid={hasError || props['aria-invalid']}
          aria-describedby={describedBy}
          {...props}
        />
        {rightSlot ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div> : null}
      </div>

      {hasError ? (
        <p id={errorId} role="alert" className="text-sm text-error">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

