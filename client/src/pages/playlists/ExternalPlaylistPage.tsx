import React, { useEffect, useRef, useState } from 'react';
import { getProviderPlaylist } from '../../apis/playlists';
import { TrackCardList } from '../../components/cards/lists/TrackCardList';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { ProviderIcon } from '../../components/icons/ProviderIcon';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { mediaProviderFromString } from '../../helper';
import { useAppSelector } from '../../store/helper';
import { ExternalPlaylist, UserTokenDTO } from '../../types';

export interface SinglePlaylistPageProps {
  provider: string;
  id: string;
}

export function ExternalPlaylistPage({ provider, id }: SinglePlaylistPageProps) {
  const finalProvider = mediaProviderFromString(provider);
  const [playlist, setPlaylist] = useState<ExternalPlaylist | undefined>(undefined);
  const userToken = useAppSelector((state) => state.auth.token);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updatePlaylist = (
    newProvider: string,
    newId: string,
    newUserToken: UserTokenDTO | undefined,
  ) => {
    const finalNewProvider = mediaProviderFromString(newProvider);
    setPlaylist(undefined);

    if (!finalNewProvider) {
      setError('Invalid provider');
    } else {
      setLoading(true);
      setError('');

      getProviderPlaylist(finalNewProvider, newId, newUserToken)
        .then((r) => {
          if (isMounted.current) {
            console.log(r);
            setLoading(false);
            setPlaylist(r);
          }
        })
        .catch((e) => {
          setLoading(false);
          setError('Either this playlist does not exist, or you must be logged in to see it.');
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
    updatePlaylist(provider, id, userToken);
  }, [provider, id, userToken]);

  let content = <p>{error}</p>;

  if (finalProvider && playlist) {
    content = (
      <>
        <TopHeading
          subheading={(
            <span>
              <ProviderIcon provider={finalProvider} /> Playlist
            </span>
          )}
          image={playlist.image}
          imageFallback="/assets/img/playlist_placeholder.png"
        >
          {playlist.name}
        </TopHeading>
        <TrackCardList tracks={playlist.tracks ?? []} />
      </>
    );
  }

  if (loading) {
    content = (<LoadingSpinner size="5x" />);
  }

  return (
    <GeneralContent className="SinglePlaylistPage" padTop padBottom>
      {content}
    </GeneralContent>
  );
}
