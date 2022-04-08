import React, { PropsWithChildren } from 'react';
import './Grid.scss';

export interface GridProps extends PropsWithChildren<{}> {
  className?: string;
}

export function Grid({ children, className }: GridProps) {
  return (
    <div className={`Grid ${className}`}>
      {children}
    </div>
  );
}

Grid.defaultProps = {
  className: '',
};
