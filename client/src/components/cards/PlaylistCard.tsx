import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalPlaylist, PlaylistDTO } from '../../types/public';
import { SquareImage } from '../structure/SquareImage';
import './PlaylistCard.scss';

export interface ExternalPlaylistCardProps {
  playlist: ExternalPlaylist;
  isLink?: boolean;
}

/**
 * Creates a card for an external playlist
 * @param props The props object
 * @returns A playlist card
 */
export function ExternalPlaylistCard({ playlist, isLink }: ExternalPlaylistCardProps) {
  const content = (
    <>
      <SquareImage className="PlaylistCard__Image" src={playlist.image} fallbackSrc="/assets/img/playlist_placeholder.png" />
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

ExternalPlaylistCard.defaultProps = {
  isLink: false,
};

export interface InternalPlaylistCardProps {
  playlist: PlaylistDTO;
  isLink?: boolean;
}

/**
 * Creates a card for an internal playlist
 * @param props The props object
 * @returns A playlist card
 */
export function InternalPlaylistCard({ playlist, isLink }: InternalPlaylistCardProps) {
  const content = (
    <>
      <SquareImage className="PlaylistCard__Image" src="" fallbackSrc="/assets/img/playlist_placeholder.png" />
      <div className="PlaylistCard__Main">
        <p className="PlaylistCard__Name">{playlist.name}</p>
      </div>
    </>
  );
  if (isLink) {
    return (
      <Link to={`/playlists/${playlist.id}`} className="PlaylistCard">
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

InternalPlaylistCard.defaultProps = {
  isLink: false,
};
