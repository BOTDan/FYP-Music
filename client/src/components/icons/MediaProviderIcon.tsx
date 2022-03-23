import React from 'react';
import {
  faSoundcloud, faSpotify, faYoutube, IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MediaProvider } from '../../types';
import './MediaProviderIcon.scss';

export interface MediaProviderIconProps {
  provider: MediaProvider;
  fgColour?: boolean;
}

const icons: { [provider in MediaProvider]: IconDefinition } = {
  [MediaProvider.YouTube]: faYoutube,
  [MediaProvider.Spotify]: faSpotify,
  [MediaProvider.SoundCloud]: faSoundcloud,
};

const classes: { [provider in MediaProvider]: string } = {
  [MediaProvider.YouTube]: 'YouTube',
  [MediaProvider.Spotify]: 'Spotify',
  [MediaProvider.SoundCloud]: 'SoundCloud',
};

/**
 * Creates an icon for the given media provider
 * @param props The props object
 * @returns An icon for the given media provider
 */
export function MediaProviderIcon({ provider, fgColour }: MediaProviderIconProps) {
  const fgClass = fgColour ? 'fg' : '';
  return (
    <span className={`MediaProviderIcon ${classes[provider]} ${fgClass}`}>
      <FontAwesomeIcon icon={icons[provider]} fixedWidth />
    </span>
  );
}

MediaProviderIcon.defaultProps = {
  fgColour: false,
};
