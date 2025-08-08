'use client';
import { useState } from 'react';
import { FaTimes } from '@/app/components/common/SvgIcons';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioSettingsModal({ isOpen, onClose }: AudioSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'repeat' | 'reciter'>('repeat');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-[var(--background)] p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              className={`pb-1 border-b-2 ${activeTab === 'repeat' ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
              onClick={() => setActiveTab('repeat')}
            >
              Repeat
            </button>
            <button
              className={`pb-1 border-b-2 ${activeTab === 'reciter' ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
              onClick={() => setActiveTab('reciter')}
            >
              Reciter
            </button>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaTimes size={16} />
          </button>
        </div>
        {activeTab === 'repeat' ? <div>Repeat settings</div> : <div>Reciter settings</div>}
      </div>
    </div>
  );
}
