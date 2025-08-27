'use client';

import React from 'react';
import { Brain } from 'lucide-react';

const MemorizationHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <Brain size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">Memorization Plan</h1>
          <p className="text-xs text-muted">Track your memorization progress</p>
        </div>
      </div>
    </div>
  );
};

export default MemorizationHeader;
