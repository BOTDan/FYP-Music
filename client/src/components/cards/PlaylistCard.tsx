import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalPlaylist } from '../../types';
import { SquareImage } from '../structure/SquareImage';
import './PlaylistCard.scss';

export interface PlaylistCardProps {
  playlist: ExternalPlaylist;
  isLink?: boolean;
}

export function PlaylistCard({ playlist, isLink }: PlaylistCardProps) {
  const content = (
    <>
      <SquareImage className="PlaylistCard__Image" src={playlist.image} />
      <div className="PlaylistCard__Main">
        <p className="PlaylistCard__Name">{ playlist.name }</p>
      </div>
    </>
  );
  if (isLink) {
    return (
      <Link to={`/playlists/${playlist.provider}/${playlist.providerId}`} className="PlaylistCard">
        {content}
      </Link>
    );
  }
  return (
    <div className="PlaylistCard">
      {content}
    </div>
  );
}

PlaylistCard.defaultProps = {
  isLink: false,
};
