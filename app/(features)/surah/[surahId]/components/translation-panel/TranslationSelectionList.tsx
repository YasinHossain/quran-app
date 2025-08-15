'use client';

import React from 'react';
import { GripVertical, X } from 'lucide-react';
import { MAX_SELECTIONS } from './useTranslationPanel';
import { Translation } from './translationPanel.types';

interface TranslationSelectionListProps {
  theme: string;
  orderedSelection: number[];
  translations: Translation[];
  handleSelectionToggle: (id: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
}

export const TranslationSelectionList: React.FC<TranslationSelectionListProps> = ({
  theme,
  orderedSelection,
  translations,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}) => (
  <div>
    <h2
      className={`text-sm font-semibold px-1 mb-2 flex items-center justify-between ${
        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
      }`}
    >
      <span>
        MY SELECTIONS ({orderedSelection.length}/{MAX_SELECTIONS})
      </span>
      {orderedSelection.length >= MAX_SELECTIONS && (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          MAX
        </span>
      )}
    </h2>
    <div
      className={`space-y-2 min-h-[40px] rounded-lg p-2 ${
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
      } border`}
    >
      {orderedSelection.length === 0 ? (
        <p
          className={`text-center text-sm py-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
        >
          No translations selected
        </p>
      ) : (
        orderedSelection.map((id) => {
          const item = translations.find((t) => t.id === id);
          if (!item) return null;
          return (
            <div
              key={id}
              draggable
              onDragStart={(e) => handleDragStart(e, id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between p-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-opacity border ${
                draggedId === id ? 'opacity-50' : 'opacity-100'
              } ${theme === 'dark' ? 'bg-slate-700/50 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center min-w-0">
                <GripVertical
                  className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`font-medium text-sm truncate ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <button
                onClick={() => handleSelectionToggle(id)}
                className={`hover:text-red-500 transition-colors p-1 rounded-full flex-shrink-0 ml-2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default TranslationSelectionList;
