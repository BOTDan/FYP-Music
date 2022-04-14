import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { formatTime } from '../../helper';
import { ExternalTrack, PlaylistDTO, TrackOnPlaylistDTO } from '../../types/public';
import { ProviderIcon } from '../icons/ProviderIcon';
import { Button } from '../input/Button';
// eslint-disable-next-line import/no-cycle
import { TrackOptionsPopup } from '../popup/popups/TrackOptionsPopup';
import './TrackCard.scss';

export interface TrackCardProps {
  track: ExternalTrack | TrackOnPlaylistDTO;
  playlist?: PlaylistDTO;
  number?: number | undefined;
  small?: boolean;
  inactive?: boolean;
}

export function TrackCard({
  track, number, small, inactive, playlist,
}: TrackCardProps) {
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

  const finalTrack = (track as TrackOnPlaylistDTO).track ?? (track as ExternalTrack);
  const artists = finalTrack.artists.map((artist) => artist.name).join(', ');

  const numberElement = (
    <span className="TrackCard__Number">
      {number}
    </span>
  );

  const durationElement = (
    <span className="TrackCard__Duration">
      {formatTime(finalTrack.duration)}
    </span>
  );

  const buttonElement = (
    <Button
      className="TrackCard__Actions"
      onClick={() => setOptionsPopupVisible(true)}
      leftIcon={faEllipsisVertical}
      bland
    />
  );

  const optionsPopup = optionsPopupVisible
    ? (
      <TrackOptionsPopup
        visible={optionsPopupVisible}
        onClose={() => setOptionsPopupVisible(false)}
        track={track}
        playlist={playlist}
      />
    )
    : (null);

  const classList = ['TrackCard'];
  if (small) { classList.push('Small'); }
  if (inactive) { classList.push('Inactive'); }

  return (
    <div className={classList.join(' ')}>
      {!small && numberElement}
      <span className="TrackCard__Provider">
        <ProviderIcon provider={finalTrack.provider} />
      </span>
      <span className="TrackCard__Image">
        <img src={finalTrack.image} alt="" />
      </span>
      <span className="TrackCard__Main">
        <p className="TrackCard__Name">{ finalTrack.name }</p>
        <p className="TrackCard__Artists">{ artists }</p>
      </span>
      {!small && durationElement}
      {!inactive && buttonElement}
      {optionsPopup}
    </div>
  );
}

TrackCard.defaultProps = {
  number: undefined,
  small: false,
  inactive: false,
  playlist: undefined,
};
