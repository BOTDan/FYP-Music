import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  ButtonHTMLAttributes, MouseEvent, PropsWithChildren, useCallback,
} from 'react';
import { To, useNavigate } from 'react-router';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import './Button.scss';

interface ButtonProps extends PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>> {
  onClick?: (event?: MouseEvent) => void;
  to?: To;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  primary?: boolean;
  bland?: boolean;
  loading?: boolean;
}

export function Button({
  children, onClick, className, leftIcon, rightIcon, disabled, primary, bland, loading, to,
  ...remainingProps
}: ButtonProps) {
  const navigate = useNavigate();

  const handleOnClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (to) {
      navigate(to);
    }
    if (onClick && !disabled) {
      onClick(event);
    }
  }, [onClick, disabled]);

  let leftIconComponent = (leftIcon) ? <FontAwesomeIcon icon={leftIcon} fixedWidth /> : (null);
  if (loading) {
    leftIconComponent = <LoadingSpinner inline />;
  }
  const rightIconComponent = (rightIcon) ? <FontAwesomeIcon icon={rightIcon} fixedWidth /> : (null);

  const classList = ['Button'];
  if (className) { classList.push(className); }
  if (primary) {
    classList.push('primary');
  } else if (bland) {
    classList.push('bland');
  }

  return (
    <button
      className={classList.join(' ')}
      type="button"
      onClick={handleOnClick}
      disabled={disabled || loading}
      {...remainingProps}
    >
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
  loading: false,
  to: undefined,
};
