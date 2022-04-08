import React from 'react';
import { ProviderIcon } from '../../components/icons/ProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { mediaProviderFromString } from '../../helper';

export interface SinglePlaylistPageProps {
  provider: string;
  id: string;
}

export function SinglePlaylistPage({ provider, id }: SinglePlaylistPageProps) {
  const finalProvider = mediaProviderFromString(provider);

  if (finalProvider) {
    return (
      <GeneralContent className="PlaylistsPageResults" padTop padBottom>
        <TopHeading subheading={(
          <span>
            <ProviderIcon provider={finalProvider} /> Playlist
          </span>
        )}
        >
          {id}
        </TopHeading>
      </GeneralContent>
    );
  }
  return (
    <GeneralContent className="PlaylistsPageResults">
      <TopHeading subheading="Playlists">{id}</TopHeading>
    </GeneralContent>
  );
}
