import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, ReactNode } from 'react';
import './MultiSelect.scss';

export interface MultiSelectOption<T> {
  name: string;
  content: ReactNode | string;
  value: T;
}

export interface MultiSelectProps<T> {
  rightAlign?: boolean;
  className?: string;
  options: MultiSelectOption<T>[];
  checked: MultiSelectOption<T>[];
  onChange(option: MultiSelectOption<T>, checked: boolean): void;
}

export function MultiSelect({
  className, rightAlign, options, checked, onChange,
}: MultiSelectProps<any>) {
  function handleOnChange(event: ChangeEvent<HTMLInputElement>, option: MultiSelectOption<any>) {
    onChange(option, event.target.checked);
  }

  const classList = ['MultiSelect'];
  if (className) { classList.push(className); }
  if (rightAlign) { classList.push('rightAlign'); }

  const checkedNames = checked.map((o) => o.name);

  const items = options.map((option) => (
    <label className="MultiSelect__Option" key={option.name}>
      <input
        type="checkbox"
        checked={checkedNames.includes(option.name)}
        onChange={(e) => handleOnChange(e, option)}
      />
      <div className="MultiSelect__Option__Checkmark">
        <FontAwesomeIcon icon={faCheck} />
      </div>
      <div className="MultiSelect__Option__Label">
        {option.content}
      </div>
    </label>
  ));

  return (
    <div className={classList.join(' ')}>
      {items}
    </div>
  );
}

MultiSelect.defaultProps = {
  rightAlign: false,
  className: undefined,
};
