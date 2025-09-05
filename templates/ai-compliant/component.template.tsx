/**
 * MANDATORY Architecture-Compliant Component Template
 * 
 * This template MUST be followed exactly for ALL components.
 * Failure to follow this pattern violates project architecture.
 * 
 * Usage: Copy this template and replace ComponentName with your component name
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';

import type { ComponentData, ComponentAction } from '@/types';

import { useAudio } from '@/app/providers/AudioContext';


interface ComponentNameProps {
  id: string;
  data: ComponentData;
  onAction?: ComponentAction;
  className?: string;
  // Add other specific props here
}

/**
 * @description Brief description of component purpose and behavior
 * @param props Component properties
 * @returns Rendered component
 * @example
 * ```tsx
 * <ComponentName
 *   id="example-id"
 *   data={componentData}
 *   onAction={handleAction}
 *   className="custom-class"
 * />
 * ```
 */
export const ComponentName = memo(function ComponentName({
  id,
  data,
  onAction,
  className,
}: ComponentNameProps) {
  // ✅ Local state (if needed)
  const [localState, setLocalState] = useState<string>('');
  
  // ✅ REQUIRED: Context integration where applicable
  const { settings } = useSettings();
  const { currentTrack, isPlaying } = useAudio();
  const { bookmarkedVerses, toggleBookmark } = useBookmarks();
  
  // ✅ Refs for DOM access
  const componentRef = useRef<HTMLDivElement>(null);

  // ✅ REQUIRED: Memoize derived data and expensive computations
  const processedData = useMemo(() => {
    return transformData(data, settings);
  }, [data, settings]);

  const isCurrentlyPlaying = useMemo(() => {
    return currentTrack === id && isPlaying;
  }, [currentTrack, id, isPlaying]);

  // ✅ REQUIRED: Memoize all callbacks
  const handleAction = useCallback((actionType: string) => {
    onAction?.(id, actionType);
  }, [id, onAction]);

  const handleClick = useCallback(() => {
    handleAction('click');
  }, [handleAction]);

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(id);
  }, [id, toggleBookmark]);

  // ✅ REQUIRED: Proper effects with cleanup
  useEffect(() => {
    // Side effects with proper cleanup
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && componentRef.current?.contains(document.activeElement)) {
        handleClick();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleClick]);

  return (
    <div
      ref={componentRef}
      className={`
        space-y-4 p-4 md:space-y-6 md:p-6
        ${className || ''}
      `.trim()}
      data-testid={`component-${id}`}
    >
      {/* ✅ REQUIRED: Mobile-first responsive layout */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
        {/* Left column - Actions (mobile: full width, desktop: fixed width) */}
        <div className="flex justify-between md:w-16 md:flex-col md:pt-1">
          {/* ✅ REQUIRED: Touch-friendly interactions (44px minimum) */}
          <button
            className="h-11 px-4 bg-accent text-accent-foreground rounded-md touch-manipulation
                       hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            onClick={handleClick}
            aria-label={`Action for ${data.name || id}`}
          >
            Action
          </button>
          
          <button
            className="h-11 px-4 bg-secondary text-secondary-foreground rounded-md touch-manipulation
                       hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            onClick={handleToggleBookmark}
            aria-label={`Toggle bookmark for ${data.name || id}`}
          >
            {bookmarkedVerses.has(id) ? '★' : '☆'}
          </button>
        </div>

        {/* Main content area (mobile: full width, desktop: flexible) */}
        <div className="space-y-4 md:flex-grow">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {data.title}
            </h3>
            {data.subtitle && (
              <p className="text-sm text-muted-foreground">
                {data.subtitle}
              </p>
            )}
          </div>
          
          {/* Dynamic content rendering */}
          {processedData.items.map((item) => (
            <div
              key={item.id}
              className="min-h-11 p-3 bg-card text-card-foreground rounded-md border border-border"
            >
              {item.content}
            </div>
          ))}

          {/* Conditional rendering based on state */}
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

// ✅ REQUIRED: Both named and default exports
export { ComponentName };
export default ComponentName;