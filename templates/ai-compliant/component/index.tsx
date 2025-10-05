'use client';

/**
 * MANDATORY Architecture-Compliant Component Template
 *
 * Usage: Copy this template and replace ComponentName with your component name.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBookmarks, useSettings, useAudio } from '@/templates/ai-compliant/shared/contexts';

import type { ComponentAction, ComponentData, Settings } from '@/types';

function transformData(data: ComponentData, settings: Settings): ComponentData {
  return settings ? data : data;
}

export interface ComponentNameProps {
  id: string;
  data: ComponentData;
  onAction?: ComponentAction;
  className?: string;
}

function useComponentNameBehavior(id: string, onAction?: ComponentAction): {
  localState: string;
  componentRef: React.RefObject<HTMLDivElement>;
  isCurrentlyPlaying: boolean;
  bookmarkedVerses: Set<string>;
  handleClick: () => void;
  handleToggleBookmark: () => void;
} {
  const [localState, setLocalState] = useState('');
  const { settings: componentSettings } = useSettings();
  const { currentTrack, isPlaying } = useAudio();
  const { bookmarkedVerses, toggleBookmark } = useBookmarks();
  const componentRef = useRef<HTMLDivElement>(null);

  const isCurrentlyPlaying = useMemo(() => currentTrack === id && isPlaying, [currentTrack, id, isPlaying]);

  const handleAction = useCallback((actionType: string) => onAction?.(id, actionType), [id, onAction]);
  const handleClick = useCallback(() => {
    setLocalState('clicked');
    handleAction('click');
  }, [handleAction]);
  const handleToggleBookmark = useCallback(() => toggleBookmark(id), [id, toggleBookmark]);

  useEffect(() => {
    setLocalState(componentSettings.mode || '');
  }, [componentSettings]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === 'Enter' && componentRef.current?.contains(document.activeElement)) handleClick();
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleClick]);

  return { localState, componentRef, isCurrentlyPlaying, bookmarkedVerses, handleClick, handleToggleBookmark } as const;
}

function ComponentNameContent(props: ComponentContentProps): JSX.Element {
  return (
    <div
      ref={props.componentRef}
      className={`space-y-4 p-4 md:space-y-6 md:p-6 ${props.className || ''}`.trim()}
      data-testid={`component-${props.id}`}
    >
      <ComponentActions {...props} />
      <ComponentBody {...props} />
    </div>
  );
}

interface ComponentContentProps {
  id: string;
  data: ComponentData;
  className?: string;
  componentRef: React.RefObject<HTMLDivElement>;
  isCurrentlyPlaying: boolean;
  bookmarkedVerses: Set<string>;
  handleClick: () => void;
  handleToggleBookmark: () => void;
  localState: string;
}

function ComponentActions({ id, data, bookmarkedVerses, handleClick, handleToggleBookmark }: ComponentContentProps): JSX.Element {
  return (
    <div className="flex justify-between md:w-16 md:flex-col md:pt-1">
      <button
        className="h-11 px-4 bg-accent text-accent-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={handleClick}
        aria-label={`Action for ${data.name || id}`}
      >
        Action
      </button>
      <button
        className="h-11 px-4 bg-secondary text-secondary-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={handleToggleBookmark}
        aria-label={`Toggle bookmark for ${data.name || id}`}
      >
        {bookmarkedVerses.has(id) ? '★' : '☆'}
      </button>
    </div>
  );
}

function ComponentBody({ data, isCurrentlyPlaying, localState }: ComponentContentProps): JSX.Element {
  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
      <div className="space-y-4 md:flex-grow">
        <ComponentHeader data={data} />
        <ComponentItems items={data.items} />
        <ComponentStatus isPlaying={isCurrentlyPlaying} localState={localState} />
      </div>
    </div>
  );
}

function ComponentHeader({ data }: { data: ComponentData }): JSX.Element {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
      {data.subtitle && <p className="text-sm text-muted-foreground">{data.subtitle}</p>}
    </div>
  );
}

function ComponentItems({ items }: { items: ComponentData['items'] }): JSX.Element {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="min-h-11 p-3 bg-card text-card-foreground rounded-md border border-border">
          {item.content}
        </div>
      ))}
    </>
  );
}

function ComponentStatus({ isPlaying, localState }: { isPlaying: boolean; localState: string }): JSX.Element {
  return (
    <>
      {isPlaying && (
        <div className="flex items-center space-x-2 text-accent">
          <div className="h-4 w-4 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-medium">Playing</span>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{localState}</p>
    </>
  );
}

export const ComponentName = memo(function ComponentName({ id, data, onAction, className }: ComponentNameProps) {
  const { settings: componentSettings } = useSettings();
  const processedData = useMemo(() => transformData(data, componentSettings), [data, componentSettings]);
  const { localState, componentRef, isCurrentlyPlaying, bookmarkedVerses, handleClick, handleToggleBookmark } =
    useComponentNameBehavior(id, onAction);

  return (
    <ComponentNameContent
      id={id}
      data={processedData}
      className={className}
      componentRef={componentRef}
      isCurrentlyPlaying={isCurrentlyPlaying}
      bookmarkedVerses={bookmarkedVerses}
      handleClick={handleClick}
      handleToggleBookmark={handleToggleBookmark}
      localState={localState}
    />
  );
});

export { ComponentName };
export default ComponentName;
