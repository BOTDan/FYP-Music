import React, { PropsWithChildren } from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LoadingSpinner.scss';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

export interface LoadingSpinnerProps extends PropsWithChildren<{}> {
  fillWidth?: boolean;
  fillHeight?: boolean;
  size?: SizeProp;
  inline?: boolean;
}

/**
 * Creates a loading spinner
 * @param props The props for this component
 * @returns A loading spinner
 */
export function LoadingSpinner({
  children, fillWidth, fillHeight, size, inline,
}: LoadingSpinnerProps) {
  const classList = ['LoadingSpinner'];
  if (fillWidth) { classList.push('fillWidth'); }
  if (fillHeight) { classList.push('fillHeight'); }
  if (inline) { classList.push('inline'); }

  return (
    <div className={`${classList.join(' ')}`}>
      <FontAwesomeIcon icon={faCircleNotch} spin fixedWidth size={size} />
      { children }
    </div>
  );
}

LoadingSpinner.defaultProps = {
  fillWidth: false,
  fillHeight: false,
  size: '1x',
  inline: false,
};
