import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProviderIcon } from '../../components/icons/ProviderIcon';
import './SearchPageLanding.scss';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { mediaProviderFromString, mediaProviderPrettyPrint } from '../../helper';

export interface SearchPageLandingProps {
  provider: string;
}

export function SearchPageLanding({ provider }: SearchPageLandingProps) {
  const finalProvider = mediaProviderFromString(provider);

  return (
    <GeneralContent className="SearchPageLanding" center>
      <div className="SearchPageLanding__Icon">
        <FontAwesomeIcon icon={faSearch} />
        {finalProvider && <ProviderIcon provider={finalProvider} />}
      </div>
      <div className="SearchPageLanding__Content">
        <p>Search for music from{' '}
          {mediaProviderPrettyPrint(finalProvider!)}
          {' '}using the search bar above.
        </p>
      </div>
    </GeneralContent>
  );
}
