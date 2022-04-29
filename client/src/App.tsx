import React from 'react';
import './App.scss';
import { SearchManager } from './components/managers/SearchManager';
import { MainDesktop } from './components/layouts/MainDesktop';
import { PlaylistsManager } from './components/managers/PlaylistsManager';
import { PlaybackManager } from './components/managers/playback/PlaybackManager';

function App() {
  return (
    <div className="App">
      <MainDesktop />
      <SearchManager />
      <PlaylistsManager />
      <PlaybackManager />
    </div>
  );
}

export default App;
