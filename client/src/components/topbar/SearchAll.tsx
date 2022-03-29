import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { mediaProviderFromString } from '../../helper';
import { useAppDispatch, useAppSelector } from '../../store/helper';
import { updateProvider, updateSearchTerm } from '../../store/reducers/search';
import { MediaProvider } from '../../types';
import { ProviderIcon } from '../icons/ProviderIcon';
import { Dropdown, DropdownOption } from '../input/Dropdown';
import { StringInput } from '../input/StringInput';
import './SearchAll.scss';

const searchProviders: DropdownOption[] = [
  {
    name: 'YouTube',
    content: (
      <span>
        <ProviderIcon provider={MediaProvider.YouTube} fgColour />
        <span> YouTube</span>
      </span>
    ),
  },
  {
    name: 'Spotify',
    content: (
      <span>
        <ProviderIcon provider={MediaProvider.Spotify} fgColour />
        <span> Spotify</span>
      </span>
    ),
  },
  {
    name: 'SoundCloud',
    content: (
      <span>
        <ProviderIcon provider={MediaProvider.SoundCloud} fgColour />
        <span> SoundCloud</span>
      </span>
    ),
  },
];

const searchProvidersMapping = {
  [MediaProvider.YouTube]: searchProviders[0],
  [MediaProvider.Spotify]: searchProviders[1],
  [MediaProvider.SoundCloud]: searchProviders[2],
};

/**
 * A search bar for searching content from media providers
 * @returns A search bar for searching media providers
 */
export function SearchAll() {
  const searchValue = useAppSelector((state) => state.search.q);
  const searchProvider = useAppSelector((state) => state.search.provider);
  const dispatch = useAppDispatch();
  const [searchProviderOption, setSearchProviderOption] = useState(searchProviders[0]);

  function onSearchChanged(newValue: string) {
    dispatch(updateSearchTerm(newValue));
  }

  function onProviderChanged(newProvider: DropdownOption) {
    const provider = mediaProviderFromString(newProvider.name);
    if (provider) {
      dispatch(updateProvider(provider));
    }
  }

  useEffect(() => {
    setSearchProviderOption(searchProvidersMapping[searchProvider]);
  }, [searchProvider]);

  const placeholderText = `Search ${searchProviderOption.name}...`;

  return (
    <div className="SearchAll">
      <Dropdown
        value={searchProviderOption}
        options={searchProviders}
        onChange={onProviderChanged}
      />
      <StringInput
        value={searchValue}
        onChange={onSearchChanged}
        autoComplete="off"
        placeholder={placeholderText}
      />
      <span className="SearchAll__Icon">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
}
