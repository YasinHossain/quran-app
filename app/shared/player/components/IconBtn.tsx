import React from 'react';

export default function IconBtn({
  children,
  className = '',
  disabled,
  ...rest
}: React.ComponentProps<'button'>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`h-9 w-9 grid place-items-center rounded-full transition focus:outline-none focus:ring-2 ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:-translate-y-px active:scale-95 active:bg-surface/10 text-foreground focus:ring-accent/35 hover:text-accent hover:bg-interactive'
      } ${className}`}
    >
      <span className="[&>*]:h-[18px] [&>*]:w-[18px] [&>*]:stroke-[1.75]">{children}</span>
    </button>
  );
}
