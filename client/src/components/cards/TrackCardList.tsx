import React from 'react';
import { ExternalTrack } from '../../types';
import { TrackCard } from './TrackCard';

export interface TrackCardListProps {
  tracks: ExternalTrack[];
}

export function TrackCardList({ tracks }: TrackCardListProps) {
  return (
    <div>
      {tracks.map((track) => (<TrackCard track={track} />))}
    </div>
  );
}
