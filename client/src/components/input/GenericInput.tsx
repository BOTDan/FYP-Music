import React, {
  ChangeEvent, InputHTMLAttributes, KeyboardEvent, ReactNode,
} from 'react';
import './GenericInput.scss';

export interface GenericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?(value: string | number): void;
  onEnter?(): void;
  value: string | number;
  error?: string;
  label?: string;
  vertical?: boolean;
  after?: ReactNode;
}

/**
 * Creates a generic input box with label and error if needed
 * @param props The props for the element
 * @returns An input
 */
export function GenericInput({
  label, vertical, type, value, error, after, onChange, onEnter, size, ...remaining
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

  /**
   * Handles checking if enter was pressed by the user
   * @param event The KeyboardEvenet
   */
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && onEnter) {
      onEnter();
    }
  }

  const labelElem = (label) ? (<label htmlFor="entry">{label}</label>) : undefined;
  const inputElem = (
    <input
      id="entry"
      type={type ?? 'text'}
      value={value}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      size={size}
      {...remaining}
    />
  );
  const afterElem = after ?? undefined;
  const errorElem = (error) ? (<p className="Input__Error">{error}</p>) : undefined;

  const classes = ['Input'];
  if (vertical) { classes.push('vertical'); }

  return (
    <div className={classes.join(' ')}>
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
  vertical: false,
  after: undefined,
  onChange: undefined,
  onEnter: undefined,
};
