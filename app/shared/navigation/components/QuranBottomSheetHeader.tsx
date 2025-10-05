import { IconX } from '@tabler/icons-react';
import { memo } from 'react';

import { SearchInput } from '@/app/shared/components/SearchInput';

interface QuranBottomSheetHeaderProps {
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const QuranBottomSheetHeader = memo(function QuranBottomSheetHeader({
  onClose,
  searchTerm,
  setSearchTerm,
}: QuranBottomSheetHeaderProps) {
  return (
    <>
      <div className="flex justify-center pt-4 pb-2">
        <div className="w-10 h-1 bg-border rounded-full" />
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Select Quran</h2>
        <button
          onClick={onClose}
          className="btn-touch p-2 rounded-full hover:bg-interactive transition-colors"
        >
          <IconX size={20} className="text-muted" />
        </button>
      </div>
      <div className="px-6 py-4 border-b border-border">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search surahs, juz, or page..."
          variant="panel"
          size="md"
        />
      </div>
    </>
  );
});
