import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MediaProvider } from '../../types';
import { MediaProviderIcon } from '../../components/icons/MediaProviderIcon';
import './SearchPageLanding.scss';

export interface SearchPageLandingProps {
  provider: string;
}

export function SearchPageLanding({ provider }: SearchPageLandingProps) {
  const lower = provider.toLowerCase();
  const finalProvider = (Object.values(MediaProvider).includes(lower as MediaProvider))
    ? lower as MediaProvider
    : undefined;

  return (
    <div className="SearchPageLanding">
      <div className="SearchPageLanding__Icon">
        <FontAwesomeIcon icon={faSearch} />
        {finalProvider && <MediaProviderIcon provider={finalProvider} />}
      </div>
      <div className="SearchPageLanding__Content">
        <p>Search for music from {finalProvider} using the search bar above.</p>
      </div>
    </div>
  );
}
