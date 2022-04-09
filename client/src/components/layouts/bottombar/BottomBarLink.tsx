import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, To } from 'react-router-dom';
import './BottomBarLink.scss';

export interface BottomBarLinkProps {
  name: string;
  icon: IconDefinition;
  to: To;
}

export function BottomBarLink({ name, icon, to }: BottomBarLinkProps) {
  return (
    <Link className="BottomBarLink" to={to}>
      <FontAwesomeIcon className="BottomBarLink__Icon" icon={icon} />
      {name}
    </Link>
  );
}
