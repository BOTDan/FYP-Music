import { User } from './entities/User';
import { UserToken } from './entities/UserToken';

// Overwrite the Request object so the user field uses our own user type
declare module 'express-serve-static-core' {
  export interface Request {
    user?: User,
    token?: UserToken,
  }
}
