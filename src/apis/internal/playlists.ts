import {
  NextFunction, Request, Response, Router,
} from 'express';
import { body, param } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { blockBadRequests } from '.';
import { preferAuthentication, requireAuthentication } from '../../auth';
import { PlaylistVisibility } from '../../entities/Playlist';
import { User } from '../../entities/User';
import { PlaylistData, PlaylistRepository } from '../../repositories/PlalistRepository';

const routeName = 'playlists';

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

const playlistsRouter = Router();

playlistsRouter.get(
  `/me/${routeName}`,
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
  `/${routeName}/:id`,
  preferAuthentication,
  param('id').isString(),
  blockBadRequests,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const playlist = await getPlaylist(id, true);

      response.send(playlist);
    } catch (e) {
      next(e);
    }
  },
);

playlistsRouter.post(
  `/${routeName}`,
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

export default playlistsRouter;
