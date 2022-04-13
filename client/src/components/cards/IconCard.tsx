import { faChevronRight, faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { PropsWithChildren, ReactNode } from 'react';
import { Link, To } from 'react-router-dom';
import { Button } from '../input/Button';
import './IconCard.scss';

export interface IconCardProps extends PropsWithChildren<{}> {
  className?: string;
  iconContent?: ReactNode;
  icon?: IconDefinition;
  to?: To;
  showArrow?: boolean;
  onClick?: () => void;
}

/**
 * Creates a card with an icon on the left. Functions as a button
 * @param props
 * @returns An icon card
 */
export function IconCard({
  className, icon, iconContent, to, showArrow, children, onClick,
}: IconCardProps) {
  const classList = ['IconCard', className];

  const content = (
    <>
      <div className="IconCard__Left">
        {(iconContent) || <FontAwesomeIcon icon={icon!} /> }

      </div>
      <div className="IconCard__Center">
        <p>{children}</p>
      </div>
      {showArrow
    && (
    <div className="IconCard__Right">
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
    )}
    </>
  );

  if (to) {
    return (
      <Link className={classList.join(' ')} to={to}>
        {content}
      </Link>
    );
  }
  return (
    <Button className={classList.join(' ')} onClick={onClick}>
      {content}
    </Button>
  );
}

IconCard.defaultProps = {
  className: undefined,
  icon: faQuestionCircle,
  iconContent: undefined,
  to: undefined,
  showArrow: false,
  onClick: () => {},
};
