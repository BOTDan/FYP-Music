import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { IconCard } from '../../components/cards/IconCard';
import { InternalPlaylistCardList } from '../../components/cards/lists/PlaylistCardList';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { Grid } from '../../components/layout/Grid';
import { CreatePlaylistPopup } from '../../components/popup/popups/CreatePlaylistPopup';
import { TopHeading } from '../../components/structure/TopHeading';
import { useAppSelector } from '../../store/helper';
import { MediaProvider } from '../../types';
import './PlaylistsPageLanding.scss';

export function PlaylistsPageLanding() {
  const playlists = useAppSelector((state) => state.playlists.value);
  const loading = useAppSelector((state) => state.playlists.loading);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <GeneralContent className="PlaylistsPageLanding" padTop padBottom>
      <TopHeading subheading="Playlists">External Playlists</TopHeading>
      <Grid className="PlaylistsPageLanding_Providers">
        <IconCard icon={faPlus} onClick={() => setShowPopup(true)}>New Playlist</IconCard>
        {Object.values(MediaProvider).map((provider) => (
          <ProviderCard provider={provider} key={provider} />
        ))}
      </Grid>
      <TopHeading
        subheading="Playlists"
      >
        All Playlists
      </TopHeading>
      {loading
        ? (<LoadingSpinner size="5x" />)
        : (<InternalPlaylistCardList playlists={playlists} areLinks />)}
      <CreatePlaylistPopup visible={showPopup} onClose={() => setShowPopup(false)} />
    </GeneralContent>
  );
}
