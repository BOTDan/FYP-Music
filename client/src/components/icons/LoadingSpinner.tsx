import React, { PropsWithChildren } from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LoadingSpinner.scss';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

export interface LoadingSpinnerProps extends PropsWithChildren<{}> {
  fillWidth?: boolean;
  fillHeight?: boolean;
  size?: SizeProp;
}

/**
 * Creates a loading spinner
 * @param props The props for this component
 * @returns A loading spinner
 */
export function LoadingSpinner({
  children, fillWidth, fillHeight, size,
}: LoadingSpinnerProps) {
  const classList = ['LoadingSpinner'];
  if (fillWidth) { classList.push('fillWidth'); }
  if (fillHeight) { classList.push('fillHeight'); }

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
};
