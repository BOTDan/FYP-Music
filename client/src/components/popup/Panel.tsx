import React, { PropsWithChildren, ReactNode } from 'react';
import { Button } from '../input/Button';
import './Panel.scss';

export interface PanelProps extends PropsWithChildren<{}> {
  header?: ReactNode | ReactNode[] | string;
  footer?: ReactNode | ReactNode[] | string;
  closeButton?: ReactNode | ReactNode[] | string;
  onClose?: () => void;
  className?: string;
}

export function Panel({
  header, children, footer, closeButton, onClose, className,
}: PanelProps) {
  return (
    <div className={`Panel ${className}`}>
      {header && (
        <div className="Panel__Header">
          { header }
        </div>
      )}
      <div className="Panel__Body">
        { children }
      </div>
      {(footer || closeButton) && (
        <div className="Panel__Footer">
          {closeButton && (
            <Button onClick={onClose}>{ closeButton }</Button>
          )}
          {footer}
        </div>
      )}
    </div>
  );
}

Panel.defaultProps = {
  header: undefined,
  footer: undefined,
  closeButton: undefined,
  onClose: undefined,
  className: undefined,
};
