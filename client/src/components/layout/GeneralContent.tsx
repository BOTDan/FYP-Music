import React, { PropsWithChildren } from 'react';
import './GeneralContent.scss';

export interface GeneralContentProps extends PropsWithChildren<{}> {
  className?: string;
  padTop?: boolean;
  padBottom?: boolean;
  center?: boolean;
}

export function GeneralContent({
  children, className, padTop, padBottom, center,
}: GeneralContentProps) {
  const classList = ['GeneralContent'];
  if (className) { classList.splice(0, 0, className); }
  if (padTop) { classList.push('pad-top'); }
  if (padBottom) { classList.push('pad-bottom'); }
  if (center) { classList.push('center'); }

  return (
    <section className={classList.join(' ')}>
      {children}
    </section>
  );
}

GeneralContent.defaultProps = {
  className: '',
  padTop: false,
  padBottom: false,
  center: false,
};
