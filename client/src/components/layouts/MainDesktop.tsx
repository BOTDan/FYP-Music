import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomBar } from './bottombar/BottomBar';
import { SideBar } from './sidebar/SideBar';
import { TopBar } from './topbar/TopBar';
import './MainDesktop.scss';
import { ToasterManager } from '../managers/ToasterManager';
import { PlaybackManager } from '../managers/playback/PlaybackManager';

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
        <div className="MainLayout__Center">
          <main className="MainLayout__Content">
            <Outlet />
          </main>
          <ToasterManager />
          <PlaybackManager />
        </div>
        <div className="MainLayout__Bottombar">
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
