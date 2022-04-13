import React, { useEffect, useRef, useState } from 'react';
import { getPlaylist } from '../../apis/playlists';
import { TrackCardList } from '../../components/cards/lists/TrackCardList';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { useAppSelector } from '../../store/helper';
import { InternalPlaylist, UserTokenDTO } from '../../types';

export interface SinglePlaylistPageProps {
  id: string;
}

export function InternalPlaylistPage({ id }: SinglePlaylistPageProps) {
  const [playlist, setPlaylist] = useState<InternalPlaylist | undefined>(undefined);
  const userToken = useAppSelector((state) => state.auth.token);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updatePlaylist = (
    newId: string,
    newUserToken: UserTokenDTO | undefined,
  ) => {
    setPlaylist(undefined);

    setLoading(true);
    setError('');

    getPlaylist(newId, newUserToken)
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
  };

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  useEffect(() => {
    updatePlaylist(id, userToken);
  }, [id, userToken]);

  let content = <p>{error}</p>;

  if (playlist) {
    content = (
      <>
        <TopHeading
          subheading="Playlist"
          image={playlist.image}
          imageFallback="/assets/img/playlist_placeholder.png"
        >
          {playlist.name}
        </TopHeading>
        <TrackCardList
          tracks={playlist.tracks ?? []}
          playlist={playlist}
        />
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
