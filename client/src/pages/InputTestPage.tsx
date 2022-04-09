import React from 'react';
import { Button } from '../components/input/Button';
// import { Dropdown } from '../components/input/Dropdown';
import { StringInput } from '../components/input/StringInput';
import { SearchAll } from '../components/layouts/topbar/SearchAll';

export function InputTestPage() {
  // const dropdownOptions = [
  //   { name: 'Test 1', content: 'This is a test' },
  //   { name: 'Test 2', content: 'Even more of a test' },
  // ];
  return (
    <div>
      <StringInput value="" label="String Input" name="TestTextInput" />
      <SearchAll />
      <Button onClick={() => console.log('Hello')}>This is a button</Button>
      {/* <Dropdown options={dropdownOptions}>This is a dropdown</Dropdown> */}
    </div>
  );
}
