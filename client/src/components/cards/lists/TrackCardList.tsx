import React from 'react';
import { ExternalTrack, PlaylistDTO, TrackOnPlaylistDTO } from '../../../types/public';
import { TrackCard } from '../TrackCard';

export interface TrackCardListProps {
  tracks: ExternalTrack[] | TrackOnPlaylistDTO[];
  playlist?: PlaylistDTO;
}

export function TrackCardList({ tracks, playlist }: TrackCardListProps) {
  return (
    <div>
      {tracks.map((track, i) => (
        <TrackCard
          track={track}
          playlist={playlist}
          number={i + 1}
          key={(track as TrackOnPlaylistDTO).id ?? (track as ExternalTrack).providerId}
        />
      ))}
    </div>
  );
}

TrackCardList.defaultProps = {
  playlist: undefined,
};
