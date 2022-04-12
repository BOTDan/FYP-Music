import { faClose } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Button } from './Button';
import { GenericInput, GenericInputProps } from './GenericInput';

interface StringInputProps extends Omit<GenericInputProps, 'type'> {
  onChange?(value: string): void;
  value: string;
  showClearButton?: boolean;
}

export function StringInput({
  onChange, showClearButton, after, ...remainingProps
}: StringInputProps) {
  function handleOnChange(value: string | number) {
    if (onChange) {
      onChange(value.toString());
    }
  }

  const afterElems = (showClearButton)
    ? (
      <>
        <Button
          leftIcon={faClose}
          onClick={() => handleOnChange('')}
          bland
        />
        {after}
      </>
    )
    : after;

  return (
    <GenericInput
      type="text"
      onChange={handleOnChange}
      after={afterElems}
      {...remainingProps}
    />
  );
}

StringInput.defaultProps = {
  onChange: () => {},
  showClearButton: false,
};
