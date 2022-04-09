import React from 'react';
import { AuthActions } from '../../auth/AuthActions';
import { SearchAll } from './SearchAll';
import './TopBar.scss';

/**
 * The main topbar for the site. Contains the searchbar and user account button
 * @returns A topbar element
 */
export function TopBar() {
  return (
    <div className="TopBar">
      <SearchAll />
      <AuthActions />
    </div>
  );
}
