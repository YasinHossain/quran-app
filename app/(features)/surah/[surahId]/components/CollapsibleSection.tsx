// app/surah/[surahId]/components/CollapsibleSection.tsx
'use client';
import { FaChevronDown } from '@/app/shared/SvgIcons';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isLast?: boolean; // Optional prop to indicate if it's the last section
  isOpen: boolean;
  onToggle: () => void;
}

export const CollapsibleSection = ({
  title,
  icon,
  children,
  isLast = false,
  isOpen,
  onToggle,
}: CollapsibleSectionProps) => {
  return (
    <div className={isLast ? '' : 'border-b border-[var(--border-color)]'}>
      {' '}
      {/* Apply border only if not the last section */}
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-semibold text-[var(--foreground)]">{title}</span>
        </div>
        <FaChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
};
