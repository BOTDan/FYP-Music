import React from 'react';
import './App.scss';
import { SearchManager } from './components/managers/SearchManager';
import { MainDesktop } from './components/layouts/MainDesktop';
import { PlaylistsManager } from './components/managers/PlaylistsManager';

function App() {
  return (
    <div className="App">
      <MainDesktop />
      <SearchManager />
      <PlaylistsManager />
      <div id="Modals" />
    </div>
  );
}

export default App;
