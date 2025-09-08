/**
 * MANDATORY Architecture-Compliant Component Template
 *
 * Usage: Copy this template and replace ComponentName with your component name.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBookmarks, useSettings, useAudio } from '@/templates/ai-compliant/shared/contexts';

import type { ComponentData, ComponentAction } from '@/types';

interface ComponentNameProps {
  id: string;
  data: ComponentData;
  onAction?: ComponentAction;
  className?: string;
}

export const ComponentName = memo(function ComponentName({
  id,
  data,
  onAction,
  className,
}: ComponentNameProps) {
  const [localState, setLocalState] = useState('');

  const { settings } = useSettings();
  const { currentTrack, isPlaying } = useAudio();
  const { bookmarkedVerses, toggleBookmark } = useBookmarks();

  const componentRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo(
    () => transformData(data, settings),
    [data, settings],
  );

  const isCurrentlyPlaying = useMemo(
    () => currentTrack === id && isPlaying,
    [currentTrack, id, isPlaying],
  );

  const handleAction = useCallback(
    (actionType: string) => onAction?.(id, actionType),
    [id, onAction],
  );

  const handleClick = useCallback(() => {
    handleAction('click');
  }, [handleAction]);

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(id);
  }, [id, toggleBookmark]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        componentRef.current?.contains(document.activeElement)
      ) {
        handleClick();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleClick]);

  return (
    <div
      ref={componentRef}
      className={`space-y-4 p-4 md:space-y-6 md:p-6 ${className || ''}`.trim()}
      data-testid={`component-${id}`}
    >
      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
        <div className="flex justify-between md:w-16 md:flex-col md:pt-1">
          <button
            className="h-11 px-4 bg-accent text-accent-foreground rounded-md"
            onClick={handleClick}
            aria-label={`Action for ${data.name || id}`}
          >
            Action
          </button>

          <button
            className="h-11 px-4 bg-secondary text-secondary-foreground rounded-md"
            onClick={handleToggleBookmark}
            aria-label={`Toggle bookmark for ${data.name || id}`}
          >
            {bookmarkedVerses.has(id) ? '★' : '☆'}
          </button>
        </div>

        <div className="space-y-4 md:flex-grow">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {data.title}
            </h3>
            {data.subtitle && (
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
            )}
          </div>

          {processedData.items.map((item) => (
            <div
              key={item.id}
              className="min-h-11 p-3 bg-card text-card-foreground rounded-md border border-border"
            >
              {item.content}
            </div>
          ))}

          {isCurrentlyPlaying && (
            <div className="flex items-center space-x-2 text-accent">
              <div className="h-4 w-4 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium">Playing</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export { ComponentName };
export default ComponentName;
