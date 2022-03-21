import React from 'react';
import { GenericInput, GenericInputProps } from './GenericInput';

interface StringInputProps extends Omit<GenericInputProps, 'type'> {
  onChange?(value: string): void;
  value: string;
}

export function StringInput({ onChange, ...remainingProps }: StringInputProps) {
  const handleOnChange = (value: string | number) => {
    if (onChange) {
      onChange(value.toString());
    }
  };

  return (<GenericInput type="text" onChange={handleOnChange} {...remainingProps} />);
}

StringInput.defaultProps = {
  onChange: () => {},
};
