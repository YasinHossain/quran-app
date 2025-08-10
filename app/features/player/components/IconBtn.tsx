import React from 'react';

export default function IconBtn({
  children,
  className = '',
  disabled,
  theme,
  ...rest
}: React.ComponentProps<'button'> & { theme: 'light' | 'dark' }) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`h-9 w-9 grid place-items-center rounded-full transition focus:outline-none focus:ring-2 ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : `hover:-translate-y-px active:scale-95 active:bg-slate-900/10 ${
              theme === 'dark'
                ? 'text-slate-300 focus:ring-sky-500/35 hover:bg-white/10'
                : 'text-[#0E2A47]/80 focus:ring-[#0E2A47]/35 hover:text-[#0E2A47] hover:bg-slate-900/5'
            }`
      } ${className}`}
    >
      <span className="[&>*]:h-[18px] [&>*]:w-[18px] [&>*]:stroke-[1.75]">{children}</span>
    </button>
  );
}
