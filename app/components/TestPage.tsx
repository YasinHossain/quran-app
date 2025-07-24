'use client';
import React from 'react';

// NOTE: This is a simplified version for debugging.
// It does not use the ThemeContext and handles its own state.
export default function TestPage() {
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    // Basic theme toggling for this test page
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    // This is the main container. It ONLY has background classes.
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-200 to-cyan-300 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900">
      <div className="p-10">
        <h1 className="text-4xl font-bold text-black dark:text-white">This is a test page.</h1>
        <p className="mt-4 text-black dark:text-white">
          The background of this page should be a green/cyan gradient in light mode, and a dark gray
          gradient in dark mode.
        </p>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="mt-6 rounded-lg bg-white/50 px-4 py-2 font-bold text-black shadow-lg dark:bg-white/20 dark:text-white"
        >
          Toggle Theme (Current: {theme})
        </button>
      </div>
    </div>
  );
}
