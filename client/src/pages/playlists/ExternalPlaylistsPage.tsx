import React, { useEffect, useRef, useState } from 'react';
import { getProviderPlaylists } from '../../apis/playlists';
import { ExternalPlaylistCardList } from '../../components/cards/lists/PlaylistCardList';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { ProviderIcon } from '../../components/icons/ProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { mediaProviderFromString, mediaProviderPrettyPrint } from '../../helper';
import { useAppSelector } from '../../store/helper';
import { ExternalPlaylist, UserTokenDTO } from '../../types/public';

export interface AllPlaylistsPageProps {
  provider: string;
}

export function ExternalPlaylistsPage({ provider }: AllPlaylistsPageProps) {
  const finalProvider = mediaProviderFromString(provider);
  const userToken = useAppSelector((state) => state.auth.token);
  const [playlists, setPlaylists] = useState<ExternalPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);

  const updatePlaylists = (
    newProvider: string,
    newUserToken: UserTokenDTO | undefined,
  ) => {
    const finalNewProvider = mediaProviderFromString(newProvider);
    setPlaylists([]);

    if (finalNewProvider && newUserToken) {
      setLoading(true);

      getProviderPlaylists(finalNewProvider, newUserToken)
        .then((r) => {
          if (isMounted.current) {
            console.log(r);
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
    updatePlaylists(provider, userToken);
  }, [provider, userToken]);

  if (finalProvider) {
    return (
      <GeneralContent className="PlaylistsPageResults" padTop padBottom>
        <TopHeading subheading={(
          <span>
            <ProviderIcon provider={finalProvider} /> Playlists
          </span>
        )}
        >
          Your {mediaProviderPrettyPrint(finalProvider)} Playlists
        </TopHeading>
        {loading
          ? (<LoadingSpinner size="5x" />)
          : (<ExternalPlaylistCardList playlists={playlists} areLinks />)}
      </GeneralContent>
    );
  }
  return (
    <GeneralContent className="PlaylistsPageResults">
      <TopHeading subheading="Playlists">Unknown Provider...</TopHeading>
    </GeneralContent>
  );
}
