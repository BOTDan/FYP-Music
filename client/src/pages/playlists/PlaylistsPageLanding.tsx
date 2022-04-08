import React from 'react';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { Grid } from '../../components/layout/Grid';
import { TopHeading } from '../../components/structure/TopHeading';
import { MediaProvider } from '../../types';
import './PlaylistsPageLanding.scss';

export function PlaylistsPageLanding() {
  return (
    <GeneralContent className="PlaylistsPageLanding" padTop padBottom>
      <TopHeading subheading="Playlists">External Playlists</TopHeading>
      <Grid className="PlaylistsPageLanding_Providers">
        {Object.values(MediaProvider).map((provider) => (
          <ProviderCard provider={provider} key={provider} />
        ))}
      </Grid>
      <TopHeading subheading="Playlists">All Playlists</TopHeading>
    </GeneralContent>
  );
}
