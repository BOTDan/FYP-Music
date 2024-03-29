import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import './index.scss';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { InputTestPage } from './pages/InputTestPage';
import { SearchPage } from './pages/search/SearchPage';
import store from './store';
import { PlaylistsPage } from './pages/playlists/PlaylistsPage';
import { AccountPage } from './pages/account/AccountPage';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />}>
            {/* Search routing */}
            <Route path="search/*" element={<SearchPage />} />
            {/* Playlists routing */}
            <Route path="playlists/*" element={<PlaylistsPage />} />
            {/* Accouint routing */}
            <Route path="account/*" element={<AccountPage />} />
            {/* Testing router */}
            <Route path="test">
              <Route path="inputs" element={<InputTestPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
