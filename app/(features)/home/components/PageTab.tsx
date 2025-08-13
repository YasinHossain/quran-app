'use client';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeContext';

const allPages = Array.from({ length: 604 }, (_, i) => i + 1);

export default function PageTab() {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allPages.map((page) => (
        <Link
          href={`/page/${page}`}
          key={page}
          className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                theme === 'light'
                  ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-50/50'
                  : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
              }`}
            >
              {page}
            </div>
            <h3
              className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
            >
              Page {page}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
