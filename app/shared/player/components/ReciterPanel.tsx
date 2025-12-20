import React from 'react';

import { RECITERS } from '@/lib/audio/reciters';

interface Props {
  localReciter: string;
  setLocalReciter: (id: string) => void;
}

export function ReciterPanel({ localReciter, setLocalReciter }: Props): React.JSX.Element {
  return (
    <div className="md:col-span-2">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 p-1">
        {RECITERS.map((r) => (
          <button
            key={r.id}
            onClick={() => setLocalReciter(r.id.toString())}
            className={`group relative flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${localReciter === r.id.toString()
                ? 'border-transparent ring-2 ring-accent shadow-sm z-10'
                : 'border-border hover:border-accent/50 hover:bg-surface-secondary/50'
              }`}
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate text-foreground">{r.name}</div>
              {r.locale && <div className="text-xs text-muted truncate">{r.locale}</div>}
            </div>
            <div
              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${localReciter === r.id.toString() ? 'border-accent' : 'border-muted'
                }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-200 ${localReciter === r.id.toString() ? 'scale-100' : 'scale-0'
                  }`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
