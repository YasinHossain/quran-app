import React from 'react';

import { RECITERS } from '@/lib/audio/reciters';

interface Props {
  localReciter: string;
  setLocalReciter: (id: string) => void;
}

export function ReciterPanel({ localReciter, setLocalReciter }: Props): React.JSX.Element {
  return (
    <div className="md:col-span-2">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-auto pr-1">
        {RECITERS.map((r) => (
          <button
            key={r.id}
            onClick={() => setLocalReciter(r.id.toString())}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
              localReciter === r.id.toString()
                ? 'border-accent bg-accent/10'
                : 'border-border hover:bg-interactive'
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium truncate text-foreground">{r.name}</div>
              {r.locale && <div className="text-xs text-muted">{r.locale}</div>}
            </div>
            <div
              className={`h-4 w-4 rounded-full border ${
                localReciter === r.id.toString() ? 'bg-accent border-accent' : 'border-border'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
