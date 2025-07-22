// app/surah/[surahId]/_components/CollapsibleSection.tsx
'use client';
import { useState } from 'react';
import { FaChevronDown } from '@/app/components/common/SvgIcons';

export const CollapsibleSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-gray-200/80 dark:border-gray-600">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{title}</span>
                </div>
                <FaChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden"><div className="p-4 pt-0">{children}</div></div>
            </div>
        </div>
    );
};