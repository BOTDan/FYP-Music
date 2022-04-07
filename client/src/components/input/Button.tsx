import React, {
  ButtonHTMLAttributes, MouseEvent, PropsWithChildren, useCallback,
} from 'react';
import './Button.scss';

interface ButtonProps extends PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>> {
  onClick?: (event?: MouseEvent) => void;
}

export function Button({
  children, onClick, className, ...remainingProps
}: ButtonProps) {
  const handleOnClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  }, []);

  return (
    <button className={`Button ${className ?? ''}`} type="button" onClick={handleOnClick} {...remainingProps}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  onClick: () => {},
};
