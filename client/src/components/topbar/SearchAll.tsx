import React, { useCallback, useState } from 'react';
import { StringInput } from '../input/StringInput';

export function SearchAll() {
  const [value, setValue] = useState('');

  const onSearchChanged = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return (
    <div className="SearchAll">
      <StringInput value={value} onChange={onSearchChanged} autoComplete="off" />
    </div>
  );
}
