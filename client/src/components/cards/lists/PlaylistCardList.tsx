import React from 'react';
import { ExternalPlaylist } from '../../../types';
import { Grid } from '../../layout/Grid';
import { PlaylistCard } from '../PlaylistCard';

export interface PlaylistCardListProps {
  playlists: ExternalPlaylist[];
  areLinks?: boolean;
}

export function PlaylistCardList({ playlists, areLinks }: PlaylistCardListProps) {
  return (
    <Grid>
      {playlists.map((playlist) => (
        <PlaylistCard
          isLink={areLinks}
          playlist={playlist}
          key={playlist.providerId}
        />
      ))}
    </Grid>
  );
}

PlaylistCardList.defaultProps = {
  areLinks: false,
};
