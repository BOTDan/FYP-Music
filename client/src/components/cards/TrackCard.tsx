import React from 'react';
import { formatTime } from '../../helper';
import { useAppDispatch } from '../../store/helper';
import { updateTrackToAdd } from '../../store/reducers/playlists';
import { ExternalTrack } from '../../types';
import { ProviderIcon } from '../icons/ProviderIcon';
import { Button } from '../input/Button';
import './TrackCard.scss';

export interface TrackCardProps {
  track: ExternalTrack;
  number?: number | undefined;
}

export function TrackCard({ track, number }: TrackCardProps) {
  const dispatch = useAppDispatch();
  const artists = track.artists.map((artist) => artist.name).join(', ');

  function test() {
    dispatch(updateTrackToAdd(track));
  }

  return (
    <div className="TrackCard">
      <span className="TrackCard__Number">
        { number }
      </span>
      <span className="TrackCard__Provider">
        <ProviderIcon provider={track.provider} />
      </span>
      <span className="TrackCard__Image">
        <img src={track.image} alt="" />
      </span>
      <span className="TrackCard__Main">
        <p className="TrackCard__Name">{ track.name }</p>
        <p className="TrackCard__Artists">{ artists }</p>
      </span>
      <span className="TrackCard__Duration">
        { formatTime(track.duration) }
      </span>
      <Button onClick={test}>+</Button>
    </div>
  );
}

TrackCard.defaultProps = {
  number: undefined,
};
