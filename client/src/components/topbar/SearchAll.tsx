import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownOption } from '../input/Dropdown';
import { StringInput } from '../input/StringInput';

export function SearchAll() {
  const [value, setValue] = useState('');

  const onSearchChanged = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const searchProviders: DropdownOption[] = [
    {
      name: 'youtube',
      content: 'YouTube',
    },
    {
      name: 'spotify',
      content: 'Spotify',
    },
  ];

  return (
    <div className="SearchAll">
      <Dropdown options={searchProviders} />
      <StringInput value={value} onChange={onSearchChanged} autoComplete="off" />
    </div>
  );
}
