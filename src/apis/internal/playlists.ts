import {
  NextFunction, Request, Response, Router,
} from 'express';
import { body, oneOf, param } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { blockBadRequests } from '.';
import { preferAuthentication, requireAuthentication } from '../../auth';
import { Playlist, PlaylistVisibility } from '../../entities/Playlist';
import { TrackOnPlaylist } from '../../entities/TrackOnPlaylist';
import { User } from '../../entities/User';
import { NotFoundError, UnauthorizedError } from '../../errors/httpstatus';
import { PlaylistData, PlaylistRepository } from '../../repositories/PlalistRepository';
import { TrackOnPlaylistRepository } from '../../repositories/TrackOnPlaylistRepo';
import { MediaProvider } from '../providers/base';
import { getOrCreateTrack } from './tracks';

const playlistsRouteName = 'playlists';
const tracksRouteName = 'tracks';

/**
 * Creates a playlist using the given options
 * @param options The playlist options
 * @returns A playlist
 */
async function createPlaylist(options: PlaylistData) {
  const playlistRepo = getCustomRepository(PlaylistRepository);
  const newPlaylist = await playlistRepo.createPlaylist(options);
  return newPlaylist;
}

/**
 * Updates a playlist in the database
 * @param playlist The playlist to update
 * @param options The playlist params to update
 * @returns The updated playlist
 */
async function updatePlaylist(playlist: Playlist, options: Partial<PlaylistData>) {
  const playlistRepo = getCustomRepository(PlaylistRepository);
  const updatedPlaylist = await playlistRepo.updatePlaylist(playlist, options);
  return updatedPlaylist;
}

/**
 * Gets a list of playlists owned by the user
 * @param user The owning user
 * @param includeTracks If the tracks in the playlist should be included
 * @returns A list of playlists
 */
async function getUserPlaylists(user: User, includeTracks = false) {
  const playlistRepo = getCustomRepository(PlaylistRepository);
  const playlists = await playlistRepo.getUserPlaylists(user, includeTracks);
  return playlists;
}

/**
 * Gets a playlist by ID
 * @param id The ID of the playlist
 * @param includeTracks If the tracks in the playlist should be included
 * @returns A playlist
 */
async function getPlaylist(id: string, includeTracks = false) {
  const playlistRepo = getCustomRepository(PlaylistRepository);
  const playlists = await playlistRepo.getPlaylist(id, includeTracks);
  return playlists;
}

/**
 * Gets the owner of the given playlist
 * @param playlist The playlist
 * @returns The owner
 */
async function getPlaylistOwner(playlist: Playlist) {
  const playlistRepo = getCustomRepository(PlaylistRepository);
  const owner = await playlistRepo.getPlaylistOwner(playlist);
  return owner;
}

/**
 * Checks if the user has permission to see the given playlist
 * @param playlist The playlist
 * @param user The user
 * @returns True if the user can see the playlist
 */
async function canSeePlaylist(playlist: Playlist, user?: User) {
  if (playlist.visibility === PlaylistVisibility.Public) { return true; }
  const owner = await getPlaylistOwner(playlist);
  if (!user || !owner) { return false; }
  if (owner.id === user.id) { return true; }
  return false;
}

/**
 * Checks if the user has permission to edit the given playlist
 * @param playlist The playlist
 * @param user The user
 * @returns True if the user can edit the playlist
 */
async function canEditPlaylist(playlist: Playlist, user?: User) {
  const owner = await getPlaylistOwner(playlist);
  if (!user || !owner) { return false; }
  if (owner.id === user.id) { return true; }
  return false;
}

/**
 * Adds a track to a playlist
 * @param playlist The playlist to add to
 * @param provider The provider of the track to add
 * @param providerId The provider id of the track to add
 * @param order The order of the track in the playlist
 * @returns The entry to the playlist
 */
async function addTrackToPlaylist(
  playlist: Playlist,
  provider: MediaProvider,
  providerId: string,
  order?: number,
  user?: User,
) {
  const track = await getOrCreateTrack(provider, providerId, user);
  const trackOnPlaylistRepo = getCustomRepository(TrackOnPlaylistRepository);
  return trackOnPlaylistRepo.addTrackToPlaylist(playlist, track);
}

/**
 * Returns a track in database entity found by ID
 * @param id The id of the track on playlist object
 * @returns The database entry
 */
async function getTrackInPlaylist(id: string) {
  const trackOnPlaylistRepo = getCustomRepository(TrackOnPlaylistRepository);
  return trackOnPlaylistRepo.getTrackInPlaylist(id);
}

/**
 * Deletes a track from the playlist
 * @param trackOnPlaylist The track on playlist to delete
 * @returns The deleted track
 */
async function deleteTrackFromPlaylist(trackOnPlaylist: TrackOnPlaylist) {
  const trackOnPlaylistRepo = getCustomRepository(TrackOnPlaylistRepository);
  return trackOnPlaylistRepo.deleteTrackFromPlaylist(trackOnPlaylist);
}

const playlistsRouter = Router();

playlistsRouter.get(
  `/me/${playlistsRouteName}`,
  requireAuthentication,
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { user } = request.token!;
      const playlists = await getUserPlaylists(user, true);

      response.send(playlists);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.get(
  `/${playlistsRouteName}/:id`,
  preferAuthentication,
  param('id').isString(),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const playlist = await getPlaylist(id, true);
      if (!playlist) {
        throw new NotFoundError(`Playlist with ID ${id} not found`);
      }
      if (!await canSeePlaylist(playlist, request.token?.user)) {
        throw new UnauthorizedError();
      }

      response.send(playlist);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.post(
  `/${playlistsRouteName}`,
  requireAuthentication,
  body('name').isString(),
  body('description').optional().isString(),
  body('visibility').optional().isIn(Object.values(PlaylistVisibility)),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, description, visibility } = request.body;
      const options: PlaylistData = {
        name,
        description,
        visibility: visibility as PlaylistVisibility,
        owner: request.token!.user,
      };
      const playlist = await createPlaylist(options);

      response.send(playlist);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.patch(
  `/${playlistsRouteName}/:id`,
  preferAuthentication,
  param('id').isString(),
  oneOf([[
    body('name').optional().isString(),
    body('description').optional().isString(),
    body('visibility').optional().isIn(Object.values(PlaylistVisibility)),
  ]]),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const { name, description, visibility } = request.body;
      const playlist = await getPlaylist(id, true);
      if (!playlist) {
        throw new NotFoundError(`Playlist with ID ${id} not found`);
      }
      if (!await canEditPlaylist(playlist, request.token?.user)) {
        throw new UnauthorizedError();
      }

      const updatedPlaylist = await updatePlaylist(playlist, {
        name, description, visibility,
      });

      response.send(updatedPlaylist);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.get(
  `/${playlistsRouteName}/:id/${tracksRouteName}`,
  preferAuthentication,
  param('id').isString(),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const playlist = await getPlaylist(id, true);
      if (!playlist) {
        throw new NotFoundError(`Playlist with ID ${id} not found`);
      }
      if (!await canSeePlaylist(playlist, request.token?.user)) {
        throw new UnauthorizedError();
      }

      response.send(playlist?.tracks);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.post(
  `/${playlistsRouteName}/:id/${tracksRouteName}`,
  requireAuthentication,
  param('id').isString(),
  body('provider').isIn(Object.values(MediaProvider)),
  body('providerId').isString(),
  body('order').optional().isNumeric(),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const { provider, providerId, order } = request.body;
      const playlist = await getPlaylist(id, true);
      if (!playlist) {
        throw new NotFoundError(`Playlist with ID ${id} not found`);
      }
      if (!await canEditPlaylist(playlist, request.token?.user)) {
        throw new UnauthorizedError();
      }

      const user = request.token?.user;
      const trackInPlaylist = await addTrackToPlaylist(playlist, provider, providerId, order, user);

      response.send(trackInPlaylist);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.delete(
  `/${playlistsRouteName}/:playlistId/${tracksRouteName}/:entryId`,
  requireAuthentication,
  param('playlistId').isString(),
  param('entryId').isString(),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { playlistId, entryId } = request.params;
      const playlist = await getPlaylist(playlistId, true);
      const user = request.token?.user;

      if (!playlist) {
        throw new NotFoundError(`Playlist with ID ${playlistId} not found`);
      }
      if (!await canEditPlaylist(playlist, user)) {
        throw new UnauthorizedError();
      }

      const trackInPlaylist = await getTrackInPlaylist(entryId);
      if (!trackInPlaylist) {
        throw new NotFoundError(`Playlist entry with ID ${entryId} not found on playlist ${playlistId}`);
      }
      if (playlist.id !== trackInPlaylist.playlist.id) {
        throw new NotFoundError(`Playlist entry with ID ${entryId} not found on playlist ${playlistId}`);
      }

      const deletedTrack = await deleteTrackFromPlaylist(trackInPlaylist);

      response.send(deletedTrack);
    } catch (e) {
      next(e);
    }
  },
);

export default playlistsRouter;
