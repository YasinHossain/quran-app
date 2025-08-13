import React from 'react';
import { RECITERS } from '@/lib/audio/reciters';

interface Props {
  theme: 'light' | 'dark';
  localReciter: string;
  setLocalReciter: (id: string) => void;
}

export default function ReciterPanel({ theme, localReciter, setLocalReciter }: Props) {
  return (
    <div className="md:col-span-2">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-auto pr-1">
        {RECITERS.map((r) => (
          <button
            key={r.id}
            onClick={() => setLocalReciter(r.id.toString())}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
              localReciter === r.id.toString()
                ? theme === 'dark'
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-[#0E2A47] bg-[#0E2A47]/5'
                : theme === 'dark'
                  ? 'border-slate-700 hover:bg-slate-700/50'
                  : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="min-w-0">
              <div
                className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-slate-200' : ''}`}
              >
                {r.name}
              </div>
              {r.locale && (
                <div
                  className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  {r.locale}
                </div>
              )}
            </div>
            <div
              className={`h-4 w-4 rounded-full $
                {localReciter === r.id.toString()
                  ? theme === 'dark'
                    ? 'bg-sky-500'
                    : 'bg-[#0E2A47]'
                  : theme === 'dark'
                    ? 'border-slate-600'
                    : 'border-slate-300'
              } border`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
