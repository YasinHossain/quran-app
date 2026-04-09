import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useReciters } from '@/app/shared/player/hooks/useReciters';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

const STORAGE_KEY_RECITER_META = 'reciterMeta';

interface Props {
  localReciter: number;
  setLocalReciter: (id: number) => void;
}

export const ReciterPanel = memo(function ReciterPanel({
  localReciter,
  setLocalReciter,
}: Props): React.JSX.Element {
  const { t } = useTranslation();
  const { reciters, isLoading, error } = useReciters();

  return (
    <div className="md:col-span-2">
      <div className="space-y-3">
        {(isLoading || error) && (
          <div>
            <div className="text-xs text-muted">
              {isLoading ? t('loading_reciters') : t('unable_to_load_reciters')}
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 p-1">
          {reciters.map((r) => {
            const isSelected = localReciter === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setLocalReciter(r.id);
                  try {
                    localStorage.setItem(STORAGE_KEY_RECITER_META, JSON.stringify(r));
                  } catch {
                    // ignore storage errors
                  }
                }}
                className={cn(
                  'group relative flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-200',
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50 hover:bg-interactive-hover',
                  touchClasses.target,
                  touchClasses.focus
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate text-foreground">{r.name}</div>
                  {r.locale && <div className="text-xs text-muted truncate">{r.locale}</div>}
                </div>
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    isSelected ? 'border-accent' : 'border-muted'
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-200 ${
                      isSelected ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
