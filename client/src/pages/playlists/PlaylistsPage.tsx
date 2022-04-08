import React from 'react';
import {
  Outlet, Route, Routes, useParams,
} from 'react-router';
import { AllPlaylistsPage } from './AllPlaylistsPage';
import './PlaylistsPage.scss';
import { PlaylistsPageLanding } from './PlaylistsPageLanding';
import { SinglePlaylistPage } from './SinglePlaylistPage';

function PlaylistsPageContent() {
  const { provider, id } = useParams();

  let element = <p>Empty</p>;

  if (provider && id) {
    element = <SinglePlaylistPage provider={provider} id={id} />;
  } else if (provider) {
    element = <AllPlaylistsPage provider={provider} />;
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
