import React from 'react';
import { TrackCardList } from '../../components/cards/TrackCardList';
import { MediaProviderIcon } from '../../components/icons/MediaProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { ExternalTrack, MediaProvider } from '../../types';
import './SearchPageResults.scss';

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
  const lower = provider.toLowerCase();
  const finalProvider = (Object.values(MediaProvider).includes(lower as MediaProvider))
    ? lower as MediaProvider
    : undefined;

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
        <TrackCardList tracks={testData} />
      </GeneralContent>
    );
  }
  return (
    <GeneralContent className="SearchPageResults">
      <TopHeading subheading="Search">{q}</TopHeading>
    </GeneralContent>
  );
}
