import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from '../config';
import { Artist } from '../entities/Artist';
import { AuthAccount } from '../entities/AuthAccount';
import { AuthAccountLinkToken } from '../entities/AuthAccountLinkToken';
import { Playlist } from '../entities/Playlist';
import { Track } from '../entities/Track';
import { TrackOnPlaylist } from '../entities/TrackOnPlaylist';
import { User } from '../entities/User';
import { UserToken } from '../entities/UserToken';

/**
 * Returns a list of entities the database needs to handle
 * @returns The netity list
 */
function getEntities() {
  return [
    User,
    UserToken,
    AuthAccount,
    AuthAccountLinkToken,
    Artist,
    Track,
    Playlist,
    TrackOnPlaylist,
  ];
}

/**
 * Returns connection options for connecting to the database
 * @returns Connection options
 */
function getConnectionOptions(): PostgresConnectionOptions {
  return {
    name: 'default',
    type: 'postgres',
    host: config.DB_HOST,
    port: Number(config.DB_PORT),
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    entities: getEntities(),
    logging: false,
    synchronize: true,
  };
}

/**
 * Returns connection options for connecting to the test database
 * @returns Connection options
 */
function getTestConnectionOptions(dropSchema: boolean = false): PostgresConnectionOptions {
  return {
    name: 'test',
    type: 'postgres',
    host: config.DB_HOST,
    port: Number(config.DB_PORT),
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    entities: getEntities(),
    logging: false,
    synchronize: true,
    dropSchema,
  };
}

/**
 * Sets up the connection to the database.
 * @param dropSchema If the schema should be dropped on connect.
 *  Can only be true in test environment
 */
export async function setupDatabase(dropSchema: boolean = false) {
  if (process.env.NODE_ENV === 'test') {
    await createConnection(getTestConnectionOptions(dropSchema));
  } else {
    await createConnection(getConnectionOptions());
  }
}

export default { setupDatabase };
