import React, { PropsWithChildren, ReactNode } from 'react';
import { Button } from '../input/Button';
import './Panel.scss';

export interface PanelProps extends PropsWithChildren<{}> {
  header?: ReactNode | ReactNode[] | string;
  footer?: ReactNode | ReactNode[] | string;
  closeButton?: ReactNode | ReactNode[] | string;
  onClose?: () => void;
  className?: string;
  isForm?: boolean;
}

export function Panel({
  header, children, footer, closeButton, onClose, className, isForm,
}: PanelProps) {
  const classList = ['Panel'];
  if (className) { classList.push(className); }
  if (isForm) { classList.push('Panel__Form'); }

  return (
    <div className={classList.join(' ')}>
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
            <Button onClick={onClose} bland>{ closeButton }</Button>
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
  className: '',
  isForm: false,
};
