import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomBar } from '../bottombar/BottomBar';
import { SideBar } from '../sidebar/SideBar';
import { TopBar } from '../topbar/TopBar';
import './MainDesktop.scss';

/**
 * Creates the main app layout, with outlet for main content of the page
 * @returns The main app layout
 */
export function MainDesktop() {
  return (
    <div className="MainLayout">
      <div className="MainLayout__Sidebar">
        <SideBar />
      </div>
      <div className="MainLayout__Main">
        <div className="MainLayout__Topbar">
          <TopBar />
        </div>
        <main className="MainLayout__Content">
          <Outlet />
        </main>
        <div className="MainLayout__Bottombar">
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
