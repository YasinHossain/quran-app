'use client';

interface FilterToggleProps {
  activeFilter: 'Uthmani' | 'IndoPak';
  setActiveFilter: (f: 'Uthmani' | 'IndoPak') => void;
}

export function FilterToggle({
  activeFilter,
  setActiveFilter,
}: FilterToggleProps): React.JSX.Element {
  return (
    <div className="flex items-center p-1 rounded-full bg-interactive border border-border">
      <button
        onClick={() => setActiveFilter('Uthmani')}
        className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          activeFilter === 'Uthmani'
            ? 'bg-surface shadow text-foreground'
            : 'text-muted hover:text-foreground hover:bg-surface/30'
        }`}
      >
        Uthmani
      </button>
      <button
        onClick={() => setActiveFilter('IndoPak')}
        className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          activeFilter === 'IndoPak'
            ? 'bg-surface shadow text-foreground'
            : 'text-muted hover:text-foreground hover:bg-surface/30'
        }`}
      >
        IndoPak
      </button>
    </div>
  );
}
