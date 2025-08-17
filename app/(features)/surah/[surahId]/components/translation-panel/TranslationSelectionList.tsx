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
      className={`text-sm font-semibold px-2 mb-3 flex items-center justify-between ${
        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
      }`}
    >
      <span>
        MY SELECTIONS ({orderedSelection.length}/{MAX_SELECTIONS})
      </span>
      {orderedSelection.length >= MAX_SELECTIONS && (
        <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 font-medium">
          MAX
        </span>
      )}
    </h2>
    <div
      className={`space-y-2 min-h-[60px] rounded-lg p-3 ${
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-slate-200'
      } border`}
    >
      {orderedSelection.length === 0 ? (
        <p
          className={`text-center text-sm py-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} font-medium`}
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
              className={`flex items-center justify-between p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
                draggedId === id ? 'opacity-50' : 'opacity-100'
              } ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 hover:bg-slate-600' : 'bg-surface border border-slate-200 hover:bg-slate-50'}`}
            >
              <div className="flex items-center min-w-0">
                <GripVertical
                  className={`h-4 w-4 mr-3 flex-shrink-0 ${
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
                className={`hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default TranslationSelectionList;
