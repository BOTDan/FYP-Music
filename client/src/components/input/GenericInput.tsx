import React, { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import './GenericInput.scss';

export interface GenericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?(value: string | number): void;
  value: string | number;
  error?: string;
  label?: string;
  after?: ReactNode;
}

/**
 * Creates a generic input box with label and error if needed
 * @param props The props for the element
 * @returns An input
 */
export function GenericInput({
  label, type, value, error, after, onChange, ...remaining
}: GenericInputProps) {
  /**
   * Handles running the callback for when the value of this input changes
   * @param event The CahngeEvent
   */
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(event.target.value);
    }
  }

  const labelElem = (label) ? (<label htmlFor="entry">{label}</label>) : undefined;
  const inputElem = (<input id="entry" type={type ?? 'text'} value={value} onChange={handleOnChange} {...remaining} />);
  const afterElem = after ?? undefined;
  const errorElem = (error) ? (<p className="Input__Error">{error}</p>) : undefined;

  return (
    <div className="Input">
      <div className="Input__Entry">
        {labelElem}
        {inputElem}
        {afterElem}
      </div>
      {errorElem}
    </div>
  );
}

GenericInput.defaultProps = {
  error: undefined,
  label: undefined,
  after: undefined,
  onChange: undefined,
};
