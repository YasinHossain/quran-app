// Component Template - Copy this pattern for new components
// Replace: ExampleComponent, ExampleType, example-data
// Location: app/(features)/[feature]/components/

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExampleType } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { someUtility } from '@/lib/utils/example';

interface ExampleComponentProps {
  id: string;
  data: ExampleType;
  isActive?: boolean;
  onAction?: (id: string) => void;
  className?: string;
}

/**
 * Brief description of what this component does.
 * 
 * Key behaviors:
 * - Handles user interactions
 * - Integrates with audio context
 * - Responsive mobile-first design
 */
export const ExampleComponent = memo(function ExampleComponent({
  id,
  data,
  isActive = false,
  onAction,
  className = '',
}: ExampleComponentProps) {
  // State
  const [localState, setLocalState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Contexts
  const { settings } = useSettings();
  const { activeVerse, setActiveVerse } = useAudio();
  const { isBookmarked } = useBookmarks();
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Derived state (memoized)
  const processedData = useMemo(() => {
    return transformData(data, settings);
  }, [data, settings]);
  
  const isCurrentActive = useMemo(() => {
    return activeVerse?.id === id;
  }, [activeVerse?.id, id]);
  
  // Callbacks (memoized)
  const handleAction = useCallback(() => {
    setIsLoading(true);
    
    try {
      onAction?.(id);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, onAction]);
  
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAction();
    }
  }, [handleAction]);
  
  // Effects
  useEffect(() => {
    // Setup intersection observer or other side effects
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Handle visibility
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [id]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or timers
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`
        mb-4 p-4 rounded-lg border border-border bg-background
        transition-colors duration-200
        ${isActive ? 'ring-2 ring-primary' : ''}
        ${className}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Action for ${data.name}`}
      onKeyDown={handleKeyPress}
    >
      {/* Mobile-first responsive layout */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        
        {/* Action buttons - Mobile: full width, Desktop: fixed width */}
        <div className="flex items-center justify-center space-x-2 md:w-16 md:flex-col md:space-x-0 md:space-y-2 md:pt-1">
          <button
            onClick={handleAction}
            disabled={isLoading}
            className="
              h-11 px-4 rounded-md bg-primary text-primary-foreground
              hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring disabled:opacity-50 touch-manipulation
              transition-colors duration-200
            "
            aria-label="Perform action"
          >
            {isLoading ? 'Loading...' : 'Action'}
          </button>
        </div>

        {/* Main content area - Mobile: full width, Desktop: flex-grow */}
        <div className="space-y-4 md:flex-grow">
          
          {/* Primary content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {processedData.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {processedData.description}
            </p>
          </div>
          
          {/* Secondary content with responsive font size */}
          <div 
            className="text-foreground leading-relaxed"
            style={{ fontSize: `${settings.fontSize || 16}px` }}
          >
            {processedData.content}
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {isBookmarked(id) && (
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Bookmarked</span>
              </span>
            )}
            {isCurrentActive && (
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExampleComponent;