'use client';

import { FontSearchField } from '@/app/shared/ui/SearchField';

interface ArabicFontSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ArabicFontSearch = ({
  searchTerm,
  setSearchTerm,
}: ArabicFontSearchProps): JSX.Element => <FontSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

export default ArabicFontSearch;
