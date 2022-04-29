import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import './Slider.scss';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?(value: number): void;
  min: number;
  max: number;
  value: number;
  vertical?: boolean;
}

/**
 * Creates a slider
 * @param props The props for the element
 * @returns A slider
 */
export function Slider({
  onChange, min, max, value, vertical, ...remaining
}: SliderProps) {
  /**
   * Handles calling the onCahnge callback when the slider changes
   * @param event The ChangeEvent
   */
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(Number(event.target.value));
    }
  };

  const classes = ['Slider'];
  if (vertical) { classes.push('vertical'); }

  return (
    <div className={classes.join(' ')}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleOnChange}
        {...remaining}
      />
    </div>
  );
}

Slider.defaultProps = {
  onChange: undefined,
  vertical: false,
};
