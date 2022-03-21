import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.scss';

function App() {
  return (
    <div className="App">
      <p>FYP Music</p>
      <Outlet />
    </div>
  );
}

export default App;
