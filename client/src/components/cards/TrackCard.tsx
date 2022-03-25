import React from 'react';
import { ExternalTrack } from '../../types';
import { MediaProviderIcon } from '../icons/MediaProviderIcon';
import './TrackCard.scss';

export interface TrackCardProps {
  track: ExternalTrack;
}

export function TrackCard({ track }: TrackCardProps) {
  const artists = track.artists.map((artist) => artist.name).join(', ');
  return (
    <div className="TrackCard">
      <span className="TrackCard__Number">
        1
      </span>
      <span className="TrackCard__Image">
        <MediaProviderIcon provider={track.provider} />
      </span>
      <span className="TrackCard__Main">
        <p className="TrackCard__Name">{ track.name }</p>
        <p className="TrackCard__Artists">{ artists }</p>
      </span>
      <span className="TrackCard__Duration">
        { track.duration }
      </span>
    </div>
  );
}
