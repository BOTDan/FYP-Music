import React from 'react';
import {
  faGoogle,
  faSoundcloud, faSpotify, faYoutube, IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthProvider, MediaProvider } from '../../types';
import './MediaProviderIcon.scss';

export interface MediaProviderIconProps {
  provider: MediaProvider | AuthProvider;
  fgColour?: boolean;
}

const icons: { [provider in MediaProvider | AuthProvider]: IconDefinition } = {
  [MediaProvider.YouTube]: faYoutube,
  [MediaProvider.Spotify]: faSpotify,
  [MediaProvider.SoundCloud]: faSoundcloud,
  [AuthProvider.Google]: faGoogle,
  [AuthProvider.Spotify]: faSpotify,
};

const classes: { [provider in MediaProvider | AuthProvider]: string } = {
  [MediaProvider.YouTube]: 'YouTube',
  [MediaProvider.Spotify]: 'Spotify',
  [MediaProvider.SoundCloud]: 'SoundCloud',
  [AuthProvider.Google]: 'Google',
  [AuthProvider.Spotify]: 'Spotify',
};

/**
 * Creates an icon for the given media provider
 * @param props The props object
 * @returns An icon for the given media provider
 */
export function ProviderIcon({ provider, fgColour }: MediaProviderIconProps) {
  const classList = ['MediaProviderIcon'];
  classList.push(classes[provider]);
  if (fgColour) { classList.push('fg'); }

  return (
    <span className={classList.join(' ')}>
      <FontAwesomeIcon icon={icons[provider]} fixedWidth />
    </span>
  );
}

ProviderIcon.defaultProps = {
  fgColour: false,
};
