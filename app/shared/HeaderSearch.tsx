import React from 'react';

import { SearchInput } from './components/SearchInput';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const HeaderSearch = ({
  query,
  setQuery,
  placeholder,
  onKeyDown,
}: Props): React.JSX.Element => {
  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      variant="header"
      size="md"
    />
  );
};
