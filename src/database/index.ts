import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from '../config';
import { AuthAccount } from '../entities/AuthAccount';
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
 * Sets up the connection to the database.
 */
export async function setupDatabase() {
  await createConnection(getConnectionOptions());
}

export default { setupDatabase };
