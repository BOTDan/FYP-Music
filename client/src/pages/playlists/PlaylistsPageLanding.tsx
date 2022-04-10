import React, { useEffect, useRef, useState } from 'react';
import { getMyPlaylists } from '../../apis/playlists';
import { InternalPlaylistCardList } from '../../components/cards/lists/PlaylistCardList';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { Grid } from '../../components/layout/Grid';
import { TopHeading } from '../../components/structure/TopHeading';
import { useAppSelector } from '../../store/helper';
import { InternalPlaylist, MediaProvider, UserTokenDTO } from '../../types';
import './PlaylistsPageLanding.scss';

export function PlaylistsPageLanding() {
  const [playlists, setPlaylists] = useState<InternalPlaylist[]>([]);
  const userToken = useAppSelector((state) => state.auth.token);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);

  const updatePlaylists = (
    newUserToken: UserTokenDTO | undefined,
  ) => {
    setPlaylists([]);

    if (newUserToken) {
      setLoading(true);

      getMyPlaylists(newUserToken)
        .then((r) => {
          if (isMounted.current) {
            setLoading(false);
            setPlaylists(r);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  };

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  useEffect(() => {
    updatePlaylists(userToken);
  }, [userToken]);

  return (
    <GeneralContent className="PlaylistsPageLanding" padTop padBottom>
      <TopHeading subheading="Playlists">External Playlists</TopHeading>
      <Grid className="PlaylistsPageLanding_Providers">
        {Object.values(MediaProvider).map((provider) => (
          <ProviderCard provider={provider} key={provider} />
        ))}
      </Grid>
      <TopHeading subheading="Playlists">All Playlists</TopHeading>
      {loading
        ? (<LoadingSpinner size="5x" />)
        : (<InternalPlaylistCardList playlists={playlists} areLinks />)}
    </GeneralContent>
  );
}
