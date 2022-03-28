import React from 'react';
import './App.scss';
import { SearchManager } from './components/managers/SearchManager';
import { MainDesktop } from './layouts/MainDesktop';

function App() {
  return (
    <div className="App">
      <MainDesktop />
      <SearchManager />
      <div id="Modals" />
    </div>
  );
}

export default App;
