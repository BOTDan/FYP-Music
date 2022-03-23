import React, { PropsWithChildren } from 'react';
import './GeneralContent.scss';

export interface GeneralContentProps extends PropsWithChildren<{}> {
  className?: string;
}

export function GeneralContent({ children, className }: GeneralContentProps) {
  return (
    <section className={`${className} GeneralContent`}>
      {children}
    </section>
  );
}

GeneralContent.defaultProps = {
  className: '',
};
