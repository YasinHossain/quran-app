import React from 'react';

import { iconClasses } from '@/lib/responsive';

/**
 * @deprecated Use Button with variant="icon-round" size="icon-round" instead
 * This component will be removed in a future version
 */
export function IconBtn({
  children,
  className = '',
  disabled,
  ...rest
}: React.ComponentProps<'button'>): React.JSX.Element {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`h-9 w-9 grid place-items-center rounded-full transition focus:outline-none focus:ring-2 ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:-translate-y-px active:scale-95 active:bg-surface/10 text-foreground focus:ring-accent/35 hover:text-accent hover:bg-interactive-hover'
      } ${className}`}
    >
      <span className={`[&>*]:${iconClasses.touch} [&>*]:${iconClasses.stroke}`}>{children}</span>
    </button>
  );
}
