import React, {
  PropsWithChildren, ReactNode, useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';
import './Dropdown.scss';

export interface DropdownOption {
  name: string;
  content: ReactNode | string;
}

export interface DropdownProps extends PropsWithChildren<any> {
  options: DropdownOption[];
}

export function Dropdown({ children, options }: DropdownProps) {
  const [selected, setSelected] = useState<DropdownOption>();
  const [expanded, setExpanded] = useState(false);

  function setOption(option: DropdownOption) {
    setSelected(option);
    setExpanded(false);
  }

  function toggleDropdown() {
    setExpanded((cur) => !cur);
  }

  const chevronIcon = expanded ? faChevronUp : faChevronDown;
  const chevronElem = <FontAwesomeIcon icon={chevronIcon} />;

  return (
    <div className={`Dropdown ${expanded ? 'expanded' : ''}`}>
      <Button onClick={() => toggleDropdown()} className="text-left">
        {selected?.content ?? children}
        <span className="Dropdown__Chevron">{chevronElem}</span>
      </Button>
      <div className={`Dropdown__Options ${expanded ? '' : 'hidden'}`}>
        {options.map((option) => {
          const selectedClass = (option === selected) ? 'selected' : '';
          return (
            <Button onClick={() => setOption(option)} key={option.name} className={`Dropdown__Option block text-left ${selectedClass}`}>
              {option.content}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
