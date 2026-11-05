'use client';

import { type ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// Icons
import { SearchIcon } from '@/icons';

// Components
import { Input } from '@/components';

interface SearchInputProps {
  placeholder?: string;
}

export const SearchInput = ({ placeholder = 'Search...', ...props }: SearchInputProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const defaultValue = searchParams.get('query') ?? '';

  const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Input
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={handleSearch}
      rightIcon={<SearchIcon width={20} height={20} />}
      {...props}
    />
  );
};
