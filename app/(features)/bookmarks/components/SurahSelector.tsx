'use client';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { ChevronDownIcon } from '@/app/shared/icons';
import { Chapter } from '@/types';
import { SurahDropdown } from './SurahDropdown';
interface SurahSelectorProps { chapters: Chapter[]; value?: number; onChange: (surahId: number) => void; placeholder?: string; disabled?: boolean; className?: string; id?: string; }
export const SurahSelector = ({ chapters, value, onChange, placeholder = 'Select Surah', disabled = false, className = '', id, }: SurahSelectorProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = chapters.find((c) => c.id === value);
  useEffect(() => {
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setTerm(''); } };
    if (open) { document.addEventListener('mousedown', handle); setTimeout(() => inputRef.current?.focus(), 50); }
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);
  const select = (c: Chapter) => { onChange(c.id); setOpen(false); setTerm(''); };
  const keyDown = (e: React.KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setTerm(''); } };
  const content = selected ? (<>
    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-xs font-semibold text-accent">{selected.id}</span></div>
    <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-foreground truncate">{selected.name_simple}</div><div className="text-xs text-muted truncate">{selected.name_arabic}</div></div>
  </>) : (<span className="text-muted">{placeholder}</span>);
  return (
    <div className={`relative ${className}`} ref={ref}>
      <button type="button" id={id} onClick={() => !disabled && setOpen(!open)} disabled={disabled} className={`w-full flex items-center justify-between px-4 py-3.5 bg-surface border border-border rounded-xl text-left text-foreground placeholder-muted transition-all duration-200 shadow-sm ${!disabled ? 'hover:shadow-md hover:border-accent/20 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none' : 'opacity-50 cursor-not-allowed'} ${open ? 'border-accent ring-4 ring-accent/10' : ''}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">{content}</div>
        <ChevronDownIcon size={18} className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (<SurahDropdown chapters={chapters} value={value} searchTerm={term} setSearchTerm={setTerm} onSelect={select} searchInputRef={inputRef} handleKeyDown={keyDown} />)}
    </div>
  );
};
