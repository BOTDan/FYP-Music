import React from 'react';
import { MediaProviderIcon } from '../../components/icons/MediaProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { MediaProvider } from '../../types';
import './SearchPageResults.scss';

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
      <GeneralContent className="SearchPageResults">
        <TopHeading subheading={(
          <span>
            <MediaProviderIcon provider={finalProvider} /> Search
          </span>
        )}
        >
          {q}
        </TopHeading>
      </GeneralContent>
    );
  }
  return (
    <GeneralContent className="SearchPageResults">
      <TopHeading subheading="Search">{q}</TopHeading>
    </GeneralContent>
  );
}
