import React, { PropsWithChildren } from 'react';
import './GeneralContent.scss';

export interface GeneralContentProps extends PropsWithChildren<{}> {
  className?: string;
  padTop?: boolean;
  padBottom?: boolean;
}

export function GeneralContent({
  children, className, padTop, padBottom,
}: GeneralContentProps) {
  const padTopClass = (padTop) ? 'pad-top' : '';
  const padBottomClass = (padBottom) ? 'pad-bottom' : '';
  return (
    <section className={`${className} GeneralContent ${padTopClass} ${padBottomClass}`}>
      {children}
    </section>
  );
}

GeneralContent.defaultProps = {
  className: '',
  padTop: false,
  padBottom: false,
};
