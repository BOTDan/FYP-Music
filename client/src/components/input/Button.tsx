import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  ButtonHTMLAttributes, MouseEvent, PropsWithChildren, useCallback,
} from 'react';
import './Button.scss';

interface ButtonProps extends PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>> {
  onClick?: (event?: MouseEvent) => void;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  primary?: boolean;
  bland?: boolean;
}

export function Button({
  children, onClick, className, leftIcon, rightIcon, disabled, primary, bland, ...remainingProps
}: ButtonProps) {
  const handleOnClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (onClick && !disabled) {
      onClick(event);
    }
  }, [onClick, disabled]);

  const leftIconComponent = (leftIcon) ? <FontAwesomeIcon icon={leftIcon} fixedWidth /> : (null);
  const rightIconComponent = (rightIcon) ? <FontAwesomeIcon icon={rightIcon} fixedWidth /> : (null);

  const classList = ['Button'];
  if (className) { classList.push(className); }
  if (primary) {
    classList.push('primary');
  } else if (bland) {
    classList.push('bland');
  }

  return (
    <button className={classList.join(' ')} type="button" onClick={handleOnClick} disabled={disabled} {...remainingProps}>
      {leftIconComponent}
      {children}
      {rightIconComponent}
    </button>
  );
}

Button.defaultProps = {
  onClick: () => {},
  leftIcon: undefined,
  rightIcon: undefined,
  primary: false,
  bland: false,
};
