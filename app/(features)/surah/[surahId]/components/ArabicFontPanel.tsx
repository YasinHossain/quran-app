'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useArabicFontPanel } from './arabic-font-panel/useArabicFontPanel';
import { ResourceList } from '@/app/shared/resource-panel';

interface ArabicFontPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArabicFontPanel: React.FC<ArabicFontPanelProps> = ({ isOpen, onClose }) => {
  const {
    loading,
    error,
    groupedFonts,
    activeFilter,
    setActiveFilter,
    selectedIds,
    handleSelectionToggle,
    handleReset,
  } = useArabicFontPanel(isOpen);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const element = listContainerRef.current;
    if (!element || !isOpen) return;

    const updateHeight = () => {
      const rect = element.getBoundingClientRect();
      const fallback = window.innerHeight - rect.top;
      setListHeight(rect.height || fallback);
    };

    updateHeight();

    const ResizeObserverConstructor =
      typeof ResizeObserver !== 'undefined' ? ResizeObserver : ResizeObserverPolyfill;

    if (ResizeObserverConstructor) {
      const observer = new ResizeObserverConstructor((entries) => {
        for (const entry of entries) {
          const rect = entry.target.getBoundingClientRect();
          const fallback = window.innerHeight - rect.top;
          setListHeight(entry.contentRect.height || fallback);
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isOpen]);

  const resourcesToRender = groupedFonts[activeFilter] || [];

  return (
    <div
      data-testid="arabic-font-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-surface text-foreground`}
    >
      <header className="flex items-center p-4 border-b border-border">
        <button
          onClick={onClose}
          className="p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center flex-grow text-foreground">
          Arabic Font Selection
        </h2>
        <button
          onClick={handleReset}
          className="p-2 rounded-full focus-visible:outline-none transition-colors text-foreground hover:bg-hover"
          title="Reset to Default"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muted" />
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 p-4 rounded-lg border bg-error/10 border-error/20 text-error">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Scrollable Content - Toggle and List */}
            <div className="flex-1 overflow-y-auto" ref={listContainerRef}>
              {/* Font Type Toggle - Uthmani/Indopak */}
              <div className="sticky top-0 z-10 py-4 border-b bg-surface/95 backdrop-blur-sm border-border">
                <div className="px-4">
                  <div className="flex items-center p-1 rounded-full bg-hover">
                    <button
                      onClick={() => setActiveFilter('Uthmani')}
                      className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        activeFilter === 'Uthmani'
                          ? 'bg-surface shadow text-foreground'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      Uthmani
                    </button>
                    <button
                      onClick={() => setActiveFilter('IndoPak')}
                      className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        activeFilter === 'IndoPak'
                          ? 'bg-surface shadow text-foreground'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      IndoPak
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-4">
                <ResourceList
                  resources={resourcesToRender}
                  rowHeight={58}
                  selectedIds={selectedIds}
                  onToggle={handleSelectionToggle}
                  height={listHeight}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
