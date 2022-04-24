import React from 'react';
import './App.scss';
import { SearchManager } from './components/managers/SearchManager';
import { MainDesktop } from './components/layouts/MainDesktop';
import { PlaylistsManager } from './components/managers/PlaylistsManager';
import { YouTubePlaybackManager } from './components/managers/playback/YouTubePlaybackManager';

function App() {
  return (
    <div className="App">
      <MainDesktop />
      <SearchManager />
      <PlaylistsManager />
      <YouTubePlaybackManager />
    </div>
  );
}

export default App;
