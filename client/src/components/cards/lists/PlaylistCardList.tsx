import React from 'react';
import { ExternalPlaylist, PlaylistDTO } from '../../../types/public';
import { Grid } from '../../layout/Grid';
import { ExternalPlaylistCard, InternalPlaylistCard } from '../PlaylistCard';

export interface ExternalPlaylistCardListProps {
  playlists: ExternalPlaylist[];
  areLinks?: boolean;
}

export function ExternalPlaylistCardList({ playlists, areLinks }: ExternalPlaylistCardListProps) {
  return (
    <Grid>
      {playlists.map((playlist) => (
        <ExternalPlaylistCard
          isLink={areLinks}
          playlist={playlist}
          key={playlist.providerId}
        />
      ))}
    </Grid>
  );
}

ExternalPlaylistCardList.defaultProps = {
  areLinks: false,
};

export interface InternalPlaylistCardListProps {
  playlists: PlaylistDTO[];
  areLinks?: boolean;
}

export function InternalPlaylistCardList({ playlists, areLinks }: InternalPlaylistCardListProps) {
  return (
    <Grid>
      {playlists.map((playlist) => (
        <InternalPlaylistCard
          isLink={areLinks}
          playlist={playlist}
          key={playlist.id}
        />
      ))}
    </Grid>
  );
}

InternalPlaylistCardList.defaultProps = {
  areLinks: false,
};
