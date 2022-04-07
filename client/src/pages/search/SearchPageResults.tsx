import debounce from 'debounce';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { searchForTrack } from '../../apis/search';
import { TrackCardList } from '../../components/cards/TrackCardList';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { ProviderIcon } from '../../components/icons/ProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { mediaProviderFromString } from '../../helper';
import { useAppSelector } from '../../store/helper';
import { ExternalTrack, MediaProvider, UserTokenDTO } from '../../types';
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
  const userToken = useAppSelector((state) => state.auth.token);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);

  const updateSearch = (
    newProvider: string,
    newQ: string,
    newUserToken: UserTokenDTO | undefined,
  ) => {
    const finalNewProvider = mediaProviderFromString(newProvider);
    setResults([]);

    if (finalNewProvider) {
      setLoading(true);

      searchForTrack(finalNewProvider, newQ, newUserToken)
        .then((r) => {
          if (isMounted.current) {
            console.log(r);
            setLoading(false);
            setResults(r);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  };

  const updateResults = useMemo(() => debounce(updateSearch, 500), []);

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
    updateResults(provider, q, userToken);
  }, [q, provider]);

  // Render
  if (finalProvider) {
    return (
      <GeneralContent className="SearchPageResults" padTop padBottom>
        <TopHeading subheading={(
          <span>
            <ProviderIcon provider={finalProvider} /> Search
          </span>
        )}
        >
          {q}
        </TopHeading>
        {loading
          ? (<LoadingSpinner size="5x" />)
          : (<TrackCardList tracks={results} />)}
      </GeneralContent>
    );
  }
  return (
    <GeneralContent className="SearchPageResults">
      <TopHeading subheading="Search">{q}</TopHeading>
    </GeneralContent>
  );
}
