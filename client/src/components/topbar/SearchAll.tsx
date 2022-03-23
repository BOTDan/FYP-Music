import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { MediaProvider } from '../../types';
import { MediaProviderIcon } from '../icons/MediaProviderIcon';
import { Dropdown, DropdownOption } from '../input/Dropdown';
import { StringInput } from '../input/StringInput';
import './SearchAll.scss';

const searchProviders: DropdownOption[] = [
  {
    name: 'YouTube',
    content: (
      <span>
        <MediaProviderIcon provider={MediaProvider.YouTube} fgColour />
        <span> YouTube</span>
      </span>
    ),
  },
  {
    name: 'Spotify',
    content: (
      <span>
        <MediaProviderIcon provider={MediaProvider.Spotify} fgColour />
        <span> Spotify</span>
      </span>
    ),
  },
];

/**
 * A search bar for searching content from media providers
 * @returns A search bar for searching media providers
 */
export function SearchAll() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('');
  const [searchProvider, setSearchProvider] = useState(searchProviders[0]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gotoSearchPage() {
    if (value || location.pathname.startsWith('/search')) {
      navigate(`/search/${searchProvider.name.toLowerCase()}/${value}`);
    }
  }

  function onSearchChanged(newValue: string) {
    setValue(newValue);
  }

  function onProviderChanged(newProvider: DropdownOption) {
    setSearchProvider(newProvider);
  }

  useEffect(() => {
    gotoSearchPage();
  }, [value, searchProvider]);

  const placeholderText = `Search ${searchProvider.name}...`;

  return (
    <div className="SearchAll">
      <Dropdown value={searchProvider} options={searchProviders} onChange={onProviderChanged} />
      <StringInput value={value} onChange={onSearchChanged} autoComplete="off" placeholder={placeholderText} />
      <span className="SearchAll__Icon">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
}
