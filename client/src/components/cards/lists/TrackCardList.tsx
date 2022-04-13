import React from 'react';
import { ExternalTrack, InternalPlaylist, TrackOnInternalPlaylist } from '../../../types';
import { TrackCard } from '../TrackCard';

export interface TrackCardListProps {
  tracks: ExternalTrack[] | TrackOnInternalPlaylist[];
  playlist?: InternalPlaylist;
}

export function TrackCardList({ tracks, playlist }: TrackCardListProps) {
  return (
    <div>
      {tracks.map((track, i) => (
        <TrackCard
          track={track}
          playlist={playlist}
          number={i + 1}
          key={(track as TrackOnInternalPlaylist).id ?? (track as ExternalTrack).providerId}
        />
      ))}
    </div>
  );
}

TrackCardList.defaultProps = {
  playlist: undefined,
};
