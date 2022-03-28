import debounce from 'debounce';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { searchForTrack } from '../../apis/search';
import { TrackCardList } from '../../components/cards/TrackCardList';
import { MediaProviderIcon } from '../../components/icons/MediaProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { mediaProviderFromString } from '../../helper';
import { ExternalTrack, MediaProvider } from '../../types';
import './SearchPageResults.scss';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testData: ExternalTrack[] = [
  {
    name: 'A song name',
    artists: [
      {
        name: 'Artist #1',
        provider: MediaProvider.YouTube,
        providerId: '',
      },
    ],
    duration: 1000,
    provider: MediaProvider.YouTube,
    providerId: 'fds',
  },
  {
    name: 'Another great song name',
    artists: [
      {
        name: 'Random artist',
        provider: MediaProvider.YouTube,
        providerId: '',
      },
      {
        name: 'Someone else',
        provider: MediaProvider.YouTube,
        providerId: '',
      },
      {
        name: '1 more guy',
        provider: MediaProvider.YouTube,
        providerId: '',
      },
    ],
    duration: 1000,
    provider: MediaProvider.YouTube,
    providerId: 'gfdgfd',
  },
];

export interface SearchPageResultsProps {
  q: string;
  provider: string;
}

export function SearchPageResults({ q, provider }: SearchPageResultsProps) {
  const finalProvider = mediaProviderFromString(provider);
  const [results, setResults] = useState<ExternalTrack[]>([]);
  const isMounted = useRef(false);

  const updateSearch = (newProvider: string, newQ: string) => {
    const finalNewProvider = mediaProviderFromString(newProvider);

    if (finalNewProvider) {
      searchForTrack(finalNewProvider, newQ)
        .then((r) => {
          if (isMounted.current) {
            console.log(r);
            setResults(r);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const updateResults = useMemo(() => debounce(updateSearch, 250), []);

  // Keep track of if we're mounted
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      updateResults.clear();
    };
  });

  // Update search results when term changes
  useEffect(() => {
    updateResults(provider, q);
  }, [q, provider]);

  // Render
  if (finalProvider) {
    return (
      <GeneralContent className="SearchPageResults" padTop padBottom>
        <TopHeading subheading={(
          <span>
            <MediaProviderIcon provider={finalProvider} /> Search
          </span>
        )}
        >
          {q}
        </TopHeading>
        <TrackCardList tracks={results} />
      </GeneralContent>
    );
  }
  return (
    <GeneralContent className="SearchPageResults">
      <TopHeading subheading="Search">{q}</TopHeading>
    </GeneralContent>
  );
}