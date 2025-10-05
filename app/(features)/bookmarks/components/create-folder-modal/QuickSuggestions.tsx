'use client';

import React from 'react';

const QUICK_SUGGESTIONS = ['Daily Reading', 'Memorization', 'Reflection', 'Favorite Verses'];

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const QuickSuggestions = ({
  onSuggestionClick,
}: QuickSuggestionsProps): React.JSX.Element => (
  <div className="mt-8 pt-6 border-t border-border">
    <h3 className="text-sm font-semibold text-foreground mb-3">Quick Suggestions</h3>
    <div className="flex flex-wrap gap-2">
      {QUICK_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg hover:bg-accent/10 hover:border-accent/20 transition-colors duration-200 text-muted hover:text-foreground"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);
