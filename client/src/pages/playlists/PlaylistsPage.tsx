import React from 'react';
import {
  Outlet, Route, Routes, useParams,
} from 'react-router';
import { ExternalPlaylistsPage } from './ExternalPlaylistsPage';
import './PlaylistsPage.scss';
import { PlaylistsPageLanding } from './PlaylistsPageLanding';
import { ExternalPlaylistPage } from './ExternalPlaylistPage';
import { mediaProviderFromString } from '../../helper';
import { InternalPlaylistPage } from './InternalPlaylistPage';

function PlaylistsPageContent() {
  const { provider, id } = useParams();

  let element = <p>Empty</p>;

  if (provider) {
    if (mediaProviderFromString(provider)) {
      if (id) {
        element = <ExternalPlaylistPage provider={provider} id={id} />;
      } else {
        element = <ExternalPlaylistsPage provider={provider} />;
      }
    } else {
      element = <InternalPlaylistPage id={provider} />;
    }
  }

  return element;
}

export function PlaylistsPage() {
  return (
    <div className="PlaylistsPage">
      <Outlet />
      <Routes>
        <Route path="/" element={<PlaylistsPageLanding />} />
        <Route path=":provider" element={<PlaylistsPageContent />} />
        <Route path=":provider/:id" element={<PlaylistsPageContent />} />
      </Routes>
    </div>
  );
}
