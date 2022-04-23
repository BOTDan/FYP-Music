import React, { useEffect } from 'react';
import { TrackCardList } from '../../components/cards/lists/TrackCardList';
import { LoadingSpinner } from '../../components/icons/LoadingSpinner';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { TopHeading } from '../../components/structure/TopHeading';
import { getPlaylistToStore } from '../../store/actions/playlists';
import { useAppAuthToken, useAppDispatch, useAppPlaylist } from '../../store/helper';
import { StoreObjectState } from '../../types';

export interface SinglePlaylistPageProps {
  id: string;
}

export function InternalPlaylistPage({ id }: SinglePlaylistPageProps) {
  // const [playlist, setPlaylist] = useState<PlaylistDTO | undefined>(undefined);
  const playlistObject = useAppPlaylist(id);
  const playlist = playlistObject?.value;
  const loading = playlistObject?.state === StoreObjectState.Loading;
  const userToken = useAppAuthToken();
  const dispatch = useAppDispatch();
  // const isMounted = useRef(false);

  // const updatePlaylist = (
  //   newId: string,
  //   newUserToken: UserTokenDTO | undefined,
  // ) => {
  //   setPlaylist(undefined);

  //   setLoading(true);
  //   setError('');

  //   getPlaylist(newId, newUserToken)
  //     .then((r) => {
  //       if (isMounted.current) {
  //         console.log(r);
  //         setLoading(false);
  //         setPlaylist(r);
  //       }
  //     })
  //     .catch((e) => {
  //       setLoading(false);
  //       setError('Either this playlist does not exist, or you must be logged in to see it.');
  //       console.log(e);
  //     });
  // };

  // useEffect(() => {
  //   isMounted.current = true;

  //   return () => {
  //     isMounted.current = false;
  //   };
  // });

  useEffect(() => {
    getPlaylistToStore(id, userToken, dispatch);
  }, [id, userToken]);

  let content = <p />;

  if (playlist) {
    content = (
      <>
        <TopHeading
          subheading="Playlist"
          // image={playlist.image}
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
