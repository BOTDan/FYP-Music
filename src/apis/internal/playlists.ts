import {
  NextFunction, Request, Response, Router,
} from 'express';
import { body, oneOf, param } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { blockBadRequests } from '.';
import { preferAuthentication, requireAuthentication } from '../../auth';
import { Playlist, PlaylistVisibility } from '../../entities/Playlist';
import { User } from '../../entities/User';
import { NotFoundError, UnauthorizedError } from '../../errors/httpstatus';
import { PlaylistData, PlaylistRepository } from '../../repositories/PlalistRepository';

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

export default playlistsRouter;
