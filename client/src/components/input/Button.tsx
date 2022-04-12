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
}

export function Button({
  children, onClick, className, leftIcon, rightIcon, disabled, ...remainingProps
}: ButtonProps) {
  const handleOnClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (onClick && !disabled) {
      onClick(event);
    }
  }, [onClick, disabled]);

  const leftIconComponent = (leftIcon) ? <FontAwesomeIcon icon={leftIcon} /> : (null);
  const rightIconComponent = (rightIcon) ? <FontAwesomeIcon icon={rightIcon} /> : (null);

  return (
    <button className={`Button ${className ?? ''}`} type="button" onClick={handleOnClick} disabled={disabled} {...remainingProps}>
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
};
